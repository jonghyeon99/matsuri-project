import oracledb
from dotenv import load_dotenv
import os

load_dotenv()

DB_CONFIG = {
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "dsn": os.getenv("DB_DSN"),
}

# 수동 매핑
CITY_MAP = {
    "幸田町": "고타초",
    "碧南市": "헤키난시",
    "豊明市": "도요아케시",
    "清須市": "기요스시",
}

def fix_cities():
    conn = oracledb.connect(**DB_CONFIG)

    for city_jp, city_ko in CITY_MAP.items():
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE matsuris SET city_ko = :city_ko
                    WHERE city_ko = :city_jp
                """, {"city_ko": city_ko, "city_jp": city_jp})
            conn.commit()
            print(f"{city_jp} → {city_ko} ({cur.rowcount}건 업데이트)")
        except Exception as e:
            print(f"실패: {city_jp} — {e}")

    conn.close()
    print("완료!")

if __name__ == "__main__":
    fix_cities()