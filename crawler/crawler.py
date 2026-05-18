"""
아이치나우 마츠리 크롤러
- 최초 실행: 2026년 1~12월 전체 수집
- 이후: 매주 월요일에 앞으로 3개월치 UPDATE (crontab으로 자동화 할 예정)
"""

import requests
import requests as req_lib
from bs4 import BeautifulSoup
import psycopg2
import time
import logging
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from dotenv import load_dotenv
import os
import re

load_dotenv()

BASE_URL = "https://aichinow.pref.aichi.jp"
DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": int(os.getenv("DB_PORT", 5432)),
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "sslmode": "require",
}
REQUEST_DELAY = 1.5
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
}

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)


# ─────────────────────────────────────────
# 일본어 감지
# ─────────────────────────────────────────
def is_japanese(text: str) -> bool:
    return bool(re.search(r'[\u3040-\u30ff\u4e00-\u9fff]', text))


# ─────────────────────────────────────────
# 도시명 수동 매핑
# ─────────────────────────────────────────
CITY_MAP = {
    "幸田町": "고타초",
    "碧南市": "헤키난시",
    "豊明市": "도요아케시",
    "清須市": "기요스시",
    "東海市": "도카이시",
    "大府市": "오부시",
    "知多市": "지타시",
    "常滑市": "도코나메시",
    "半田市": "한다시",
    "阿久比町": "아구이초",
    "東浦町": "히가시우라초",
    "南知多町": "미나미치타초",
    "美浜町": "미하마초",
    "武豊町": "다케토요초",
    "豊山町": "도요야마초",
    "大口町": "오구치초",
    "扶桑町": "후소초",
    "大治町": "다이치초",
    "蟹江町": "가니에초",
    "飛島村": "도비시마무라",
    "東郷町": "도고초",
    "長久手市": "나가쿠테시",
    "設楽町": "시타라초",
    "東栄町": "도에이초",
    "豊根村": "도요네무라",
}


# ─────────────────────────────────────────
# 번역 후처리
# ─────────────────────────────────────────
POST_PROCESS_MAP = {
    "료금": "요금",
    "녹화 센터": "녹화센터",
    "원내": "공원 내",
    "다회": "다도회",
}

def post_process(text: str) -> str:
    for wrong, correct in POST_PROCESS_MAP.items():
        text = text.replace(wrong, correct)
    return text


# ─────────────────────────────────────────
# 1단계: 캘린더에서 detail ID 수집
# ─────────────────────────────────────────
def fetch_detail_ids_for_month(year: int, month: int) -> set[int]:
    url = f"{BASE_URL}/events/calendar/{year}-{month:02d}-01/"
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        res.raise_for_status()
    except requests.RequestException as e:
        log.error(f"캘린더 요청 실패 {year}-{month:02d}: {e}")
        return set()

    soup = BeautifulSoup(res.text, "html.parser")
    ids = set()
    for a in soup.select("a[href*='/events/detail/']"):
        href = a["href"]
        parts = href.strip("/").split("/")
        try:
            detail_id = int(parts[-1])
            ids.add(detail_id)
        except ValueError:
            continue

    log.info(f"{year}-{month:02d}: {len(ids)}개 이벤트 발견")
    return ids


def collect_all_ids(months: list[tuple[int, int]]) -> set[int]:
    all_ids = set()
    for year, month in months:
        ids = fetch_detail_ids_for_month(year, month)
        all_ids |= ids
        time.sleep(REQUEST_DELAY)
    log.info(f"총 {len(all_ids)}개 고유 이벤트 수집")
    return all_ids


# ─────────────────────────────────────────
# 날짜 파싱
# ─────────────────────────────────────────
def parse_dates(date_str: str):
    if not date_str:
        return None, None
    try:
        year_match = re.search(r'(\d{4})年', date_str)
        year = int(year_match.group(1)) if year_match else date.today().year

        month_day_pairs = re.findall(r'(\d{1,2})月(\d{1,2})日', date_str)
        if not month_day_pairs:
            return None, None

        first_month = int(month_day_pairs[0][0])
        first_day   = int(month_day_pairs[0][1])
        start_date  = date(year, first_month, first_day)

        if len(month_day_pairs) >= 2:
            last_month = int(month_day_pairs[-1][0])
            last_day   = int(month_day_pairs[-1][1])
            end_date   = date(year, last_month, last_day)
        else:
            end_date = start_date

        return start_date, end_date
    except Exception:
        return None, None


# ─────────────────────────────────────────
# 2단계: 상세 페이지 파싱
# ─────────────────────────────────────────
def parse_detail_page(detail_id: int) -> dict | None:
    url = f"{BASE_URL}/events/detail/{detail_id}/"
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        res.raise_for_status()
    except requests.RequestException as e:
        log.error(f"상세 페이지 요청 실패 (id={detail_id}): {e}")
        return None

    soup = BeautifulSoup(res.text, "html.parser")

    def text(selector, default=""):
        el = soup.select_one(selector)
        return el.get_text(strip=True) if el else default

    # 종료 여부
    is_ended = bool(soup.find(string=lambda s: s and "終了しました" in s))

    # 이름, 도시
    name_jp  = text("h2.mainimg-ttl")
    city_el  = soup.select_one("p.mainimg-area span")
    city_jp  = city_el.get_text(strip=True) if city_el else ""

    # 날짜
    event_dates_jp = ""
    for p in soup.select("div.mainimg-item p"):
        t = p.get_text(strip=True)
        if "年" in t and "月" in t and "日" in t:
            event_dates_jp = t
            break

    # 이미지
    image_urls = []
    for img in soup.select("div.gallery-main ul.swiper-wrapper li.swiper-slide figure img"):
        src = img.get("src", "")
        if src and not src.startswith("/assets"):
            if src.startswith("/"):
                src = BASE_URL + src
            image_urls.append(src)

    # 설명
    short_desc_jp = text("section.detail-top p.c-txt")

    # long_desc는 contents 부분만 (기본정보 제외)
    long_desc_el = soup.select_one("div.c-con div.contents")
    if long_desc_el:
        for br in long_desc_el.find_all("br"):
            br.replace_with("\n")
        for p in long_desc_el.find_all("p"):
            p.append("\n")
        long_desc_jp = long_desc_el.get_text(strip=False).strip()
        long_desc_jp = re.sub(r'\n{3,}', '\n\n', long_desc_jp)
        long_desc_jp = re.sub(r'一覧に戻る.*', '', long_desc_jp, flags=re.DOTALL).strip()
    else:
        long_desc_jp = ""

    # 기본정보 테이블
    event_time_jp = ""
    venue_jp      = ""
    address_jp    = ""
    contact       = ""
    for row in soup.select("div._basic table tr"):
        cells = row.select("th, td")
        if len(cells) >= 2:
            key = cells[0].get_text(strip=True)
            val = cells[1].get_text(strip=True)
            if "開催時間" in key:
                event_time_jp = val[:500]
            elif "開催場所" in key or "会場" in key:
                venue_jp = val[:200]
            elif "所在地" in key:
                address_jp = val[:200]
            elif "問い合わせ" in key or "問合" in key:
                contact = val[:200]

    # 교통편
    access_train_jp = ""
    access_car_jp   = ""
    for dl in soup.select("div._access div.access-way dl"):
        dd = dl.select_one("dd")
        if not dd:
            continue
        if dl.select_one("i.ico-train"):
            access_train_jp = dd.get_text(strip=True)[:300]
        elif dl.select_one("i.ico-car"):
            access_car_jp = dd.get_text(strip=True)[:300]

    # 관련 사이트
    related_url = ""
    link_el = soup.select_one("div._links ul.links-list li a")
    if link_el:
        related_url = link_el.get("href", "")

    # 날짜 파싱
    start_date, end_date = parse_dates(event_dates_jp)

    return {
        "detail_id":       detail_id,
        "source_url":      url,
        "name_jp":         name_jp,
        "city_jp":         city_jp,
        "is_ended":        is_ended,
        "image_urls":      ",".join(image_urls),
        "short_desc_jp":   short_desc_jp[:500] if short_desc_jp else "",
        "long_desc_jp":    long_desc_jp[:3000] if long_desc_jp else "",
        "event_dates_jp":  event_dates_jp,
        "event_time_jp":   event_time_jp,
        "venue_jp":        venue_jp,
        "address_jp":      address_jp,
        "contact":         contact,
        "access_train_jp": access_train_jp,
        "access_car_jp":   access_car_jp,
        "related_url":     related_url,
        "start_date":      start_date,
        "end_date":        end_date,
        "crawled_at":      datetime.now(),
    }


# ─────────────────────────────────────────
# 3단계: Google Translate 번역 후 _jp 키를 _ko로 변환
# ─────────────────────────────────────────
def translate_event(event: dict) -> dict:
    fields_to_translate = [
        "name_jp", "city_jp", "short_desc_jp", "long_desc_jp",
        "event_dates_jp", "event_time_jp", "venue_jp", "address_jp",
        "access_train_jp", "access_car_jp",
    ]

    texts = []
    valid_fields = []
    for field in fields_to_translate:
        src = event.get(field, "")
        if src:
            texts.append(src)
            valid_fields.append(field)

    translated = {}
    if texts:
        try:
            response = req_lib.post(
                "https://translation.googleapis.com/language/translate/v2",
                params={"key": os.getenv("GOOGLE_TRANSLATE_API_KEY")},
                json={
                    "q": texts,
                    "source": "ja",
                    "target": "ko",
                    "format": "text",
                },
                timeout=30,
            )
            response.raise_for_status()
            results = response.json()["data"]["translations"]

            for field, result in zip(valid_fields, results):
                ko_field = field.replace("_jp", "_ko")
                ko_text = result["translatedText"]

                # 도시명 한자 남아있으면 수동 매핑
                if field == "city_jp" and is_japanese(ko_text):
                    ko_text = CITY_MAP.get(event.get(field, ""), ko_text)

                # 후처리
                ko_text = post_process(ko_text)
                translated[ko_field] = ko_text

        except Exception as e:
            log.warning(f"배치 번역 실패: {e}")

    for field in fields_to_translate:
        ko_field = field.replace("_jp", "_ko")
        if ko_field not in translated:
            translated[ko_field] = ""

    return translated


# ─────────────────────────────────────────
# 4단계: Oracle DB 저장 (_ko 필드만)
# ─────────────────────────────────────────
UPSERT_SQL = """
INSERT INTO matsuris (
    detail_id, source_url, name_ko, city_ko, is_ended, image_urls,
    short_desc_ko, long_desc_ko, event_dates_ko, event_time_ko,
    venue_ko, address_ko, contact, access_train_ko, access_car_ko,
    related_url, start_date, end_date, crawled_at
) VALUES (
    %(detail_id)s, %(source_url)s, %(name_ko)s, %(city_ko)s, %(is_ended)s, %(image_urls)s,
    %(short_desc_ko)s, %(long_desc_ko)s, %(event_dates_ko)s, %(event_time_ko)s,
    %(venue_ko)s, %(address_ko)s, %(contact)s, %(access_train_ko)s, %(access_car_ko)s,
    %(related_url)s, %(start_date)s, %(end_date)s, %(crawled_at)s
)
ON CONFLICT (detail_id) DO UPDATE SET
    name_ko         = EXCLUDED.name_ko,
    city_ko         = EXCLUDED.city_ko,
    is_ended        = EXCLUDED.is_ended,
    image_urls      = EXCLUDED.image_urls,
    short_desc_ko   = EXCLUDED.short_desc_ko,
    long_desc_ko    = EXCLUDED.long_desc_ko,
    event_dates_ko  = EXCLUDED.event_dates_ko,
    event_time_ko   = EXCLUDED.event_time_ko,
    venue_ko        = EXCLUDED.venue_ko,
    address_ko      = EXCLUDED.address_ko,
    contact         = EXCLUDED.contact,
    access_train_ko = EXCLUDED.access_train_ko,
    access_car_ko   = EXCLUDED.access_car_ko,
    related_url     = EXCLUDED.related_url,
    start_date      = EXCLUDED.start_date,
    end_date        = EXCLUDED.end_date,
    crawled_at      = EXCLUDED.crawled_at
"""


def save_to_db(event: dict, translated: dict, conn):
    data = {
        "detail_id":      event["detail_id"],
        "source_url":     event["source_url"],
        "is_ended":       1 if event["is_ended"] else 0,
        "image_urls":     event["image_urls"],
        "contact":        event["contact"],
        "related_url":    event["related_url"],
        "start_date":     event["start_date"],
        "end_date":       event["end_date"],
        "crawled_at":     event["crawled_at"],
        **translated,
    }
    with conn.cursor() as cur:
        cur.execute(UPSERT_SQL, data)
    conn.commit()


# ─────────────────────────────────────────
# 메인 실행
# ─────────────────────────────────────────
def get_target_months(mode: str = "full") -> list[tuple[int, int]]:
    today = date.today()
    if mode == "full":
        return [(2026, m) for m in range(1, 13)]
    else:
        months = []
        for i in range(3):
            d = today + relativedelta(months=i)
            months.append((d.year, d.month))
        return months


def run(mode: str = "full"):
    log.info(f"크롤러 시작 (mode={mode})")
    months = get_target_months(mode)
    all_ids = collect_all_ids(months)

    conn = psycopg2.connect(**DB_CONFIG)

    success, fail = 0, 0
    for detail_id in all_ids:
        event = parse_detail_page(detail_id)
        if not event:
            fail += 1
            continue
        translated = translate_event(event)
        save_to_db(event, translated, conn)
        success += 1
        log.info(f"저장 완료: {translated.get('name_ko', '')} (id={detail_id})")
        time.sleep(REQUEST_DELAY)

    conn.close()
    log.info(f"완료 — 성공: {success}, 실패: {fail}")


if __name__ == "__main__":
    run("full")