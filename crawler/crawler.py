"""
아이치나우 마츠리 크롤러
- 최초 실행: 2026년 1~12월 전체 수집
- 이후: 3개월마다 앞으로 6개월치 UPDATE
"""

import requests
from bs4 import BeautifulSoup
import oracledb
import deepl
import time
import logging
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from dotenv import load_dotenv
import os

# ─────────────────────────────────────────
# 설정
# ─────────────────────────────────────────
load_dotenv()

BASE_URL = "https://aichinow.pref.aichi.jp"
DEEPL_API_KEY = os.getenv("DEEPL_API_KEY")
DB_CONFIG = {
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "dsn": os.getenv("DB_DSN"),
}

REQUEST_DELAY = 1.5
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
}

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)


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
    for a in soup.select("a[href*='/spots/detail/']"):
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


def parse_detail_page(detail_id: int) -> dict | None:
    url = f"{BASE_URL}/spots/detail/{detail_id}/"
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

    is_ended = bool(soup.find(string=lambda s: s and "終了しました" in s))

    image_urls = [
        img["src"] for img in soup.select(".swiper-slide img[src]")
        if img.get("src")
    ]

    outline = {}
    for row in soup.select(".outline tr, table tr"):
        cells = row.select("th, td")
        if len(cells) >= 2:
            key = cells[0].get_text(strip=True)
            val = cells[1].get_text(strip=True)
            outline[key] = val

    access_train = ""
    access_car = ""
    for item in soup.select(".access-item, .access li"):
        t = item.get_text(strip=True)
        if "電車" in t or "駅" in t:
            access_train = t
        elif "車" in t or "IC" in t or "高速" in t:
            access_car = t

    related_url = ""
    related_section = soup.find(string=lambda s: s and "関連サイト" in s)
    if related_section:
        parent = related_section.find_parent()
        if parent:
            a = parent.find_next("a", href=True)
            if a:
                related_url = a["href"]

    return {
        "detail_id":      detail_id,
        "source_url":     url,
        "name_jp":        text("h1, .event-title"),
        "furigana":       text(".furigana, .kana"),
        "city_jp":        text(".city, .area"),
        "is_ended":       is_ended,
        "image_urls":     ",".join(image_urls),
        "short_desc_jp":  text(".short-desc, .lead"),
        "long_desc_jp":   text(".detail-body, .description"),
        "event_dates_jp": outline.get("開催日", ""),
        "event_time_jp":  outline.get("開催時間", ""),
        "venue_jp":       outline.get("開催場所", ""),
        "address_jp":     outline.get("所在地", ""),
        "contact":        outline.get("お問い合わせ", ""),
        "access_train_jp": access_train,
        "access_car_jp":   access_car,
        "related_url":     related_url,
        "crawled_at":      datetime.now(),
    }


def translate_event(event: dict, translator: deepl.Translator) -> dict:
    fields_to_translate = [
        "name_jp", "city_jp", "short_desc_jp", "long_desc_jp",
        "event_dates_jp", "event_time_jp", "venue_jp", "address_jp",
        "access_train_jp", "access_car_jp",
    ]
    for field in fields_to_translate:
        src = event.get(field, "")
        if not src:
            event[field.replace("_jp", "_ko")] = ""
            continue
        try:
            result = translator.translate_text(src, source_lang="JA", target_lang="KO")
            event[field.replace("_jp", "_ko")] = result.text
        except Exception as e:
            log.warning(f"번역 실패 ({field}): {e}")
            event[field.replace("_jp", "_ko")] = ""
    return event


UPSERT_SQL = """
MERGE INTO matsuris m
USING (SELECT :detail_id AS detail_id FROM dual) src
ON (m.detail_id = src.detail_id)
WHEN MATCHED THEN UPDATE SET
    name_jp          = :name_jp,
    name_ko          = :name_ko,
    furigana         = :furigana,
    city_jp          = :city_jp,
    city_ko          = :city_ko,
    is_ended         = :is_ended,
    image_urls       = :image_urls,
    short_desc_jp    = :short_desc_jp,
    short_desc_ko    = :short_desc_ko,
    long_desc_jp     = :long_desc_jp,
    long_desc_ko     = :long_desc_ko,
    event_dates_jp   = :event_dates_jp,
    event_dates_ko   = :event_dates_ko,
    event_time_jp    = :event_time_jp,
    event_time_ko    = :event_time_ko,
    venue_jp         = :venue_jp,
    venue_ko         = :venue_ko,
    address_jp       = :address_jp,
    address_ko       = :address_ko,
    contact          = :contact,
    access_train_jp  = :access_train_jp,
    access_train_ko  = :access_train_ko,
    access_car_jp    = :access_car_jp,
    access_car_ko    = :access_car_ko,
    related_url      = :related_url,
    crawled_at       = :crawled_at
WHEN NOT MATCHED THEN INSERT (
    detail_id, source_url, name_jp, name_ko, furigana,
    city_jp, city_ko, is_ended, image_urls,
    short_desc_jp, short_desc_ko, long_desc_jp, long_desc_ko,
    event_dates_jp, event_dates_ko, event_time_jp, event_time_ko,
    venue_jp, venue_ko, address_jp, address_ko, contact,
    access_train_jp, access_train_ko, access_car_jp, access_car_ko,
    related_url, crawled_at
) VALUES (
    :detail_id, :source_url, :name_jp, :name_ko, :furigana,
    :city_jp, :city_ko, :is_ended, :image_urls,
    :short_desc_jp, :short_desc_ko, :long_desc_jp, :long_desc_ko,
    :event_dates_jp, :event_dates_ko, :event_time_jp, :event_time_ko,
    :venue_jp, :venue_ko, :address_jp, :address_ko, :contact,
    :access_train_jp, :access_train_ko, :access_car_jp, :access_car_ko,
    :related_url, :crawled_at
)
"""

def save_to_db(event: dict, conn):
    with conn.cursor() as cur:
        cur.execute(UPSERT_SQL, event)
    conn.commit()


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

    translator = deepl.Translator(DEEPL_API_KEY)
    conn = oracledb.connect(**DB_CONFIG)

    success, fail = 0, 0
    for detail_id in all_ids:
        event = parse_detail_page(detail_id)
        if not event:
            fail += 1
            continue
        event = translate_event(event, translator)
        save_to_db(event, conn)
        success += 1
        log.info(f"저장 완료: {event['name_jp']} (id={detail_id})")
        time.sleep(REQUEST_DELAY)

    conn.close()
    log.info(f"완료 — 성공: {success}, 실패: {fail}")


if __name__ == "__main__":
    run("full")