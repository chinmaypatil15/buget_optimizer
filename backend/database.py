import os
import sqlite3
import math

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Create filters table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS filters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filter_type TEXT NOT NULL,
            filter_value TEXT NOT NULL
        )
    ''')

    # 2. Create baseline_metrics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS baseline_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            market TEXT NOT NULL,
            retailer TEXT NOT NULL,
            category TEXT NOT NULL,
            budget REAL NOT NULL,
            volume INTEGER NOT NULL,
            sales REAL NOT NULL,
            nns REAL NOT NULL,
            roi REAL NOT NULL
        )
    ''')

    # 3. Create brand_shares table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS brand_shares (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            brand_name TEXT NOT NULL,
            share_pct REAL NOT NULL
        )
    ''')

    # 4. Create tactics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tactics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tactic_name TEXT NOT NULL,
            media_lever TEXT NOT NULL,
            category TEXT NOT NULL,
            spend_last_year REAL NOT NULL,
            sales_last_year REAL NOT NULL
        )
    ''')

    # Seed data if empty
    cursor.execute("SELECT COUNT(*) FROM filters")
    if cursor.fetchone()[0] == 0:
        filters_data = [
            ('market', 'UK'), ('market', 'US'), ('market', 'GERMANY'), ('market', 'FRANCE'),
            ('retailer', 'AMAZON'), ('retailer', 'TESCO'), ('retailer', 'WALMART'), ('retailer', 'TARGET'),
            ('category', 'PETCARE'), ('category', 'BEVERAGES'), ('category', 'SNACKS'), ('category', 'BEAUTY'),
            ('brand', 'Felix'), ('brand', 'Gourmet'), ('brand', 'Purina One'), ('brand', 'Pro Plan'), ('brand', 'Bakers'), ('brand', 'Winalot'), ('brand', 'Dentalife'),
            ('media_lever', 'ALL'), ('media_lever', 'Search'), ('media_lever', 'Display'), ('media_lever', 'Video'), ('media_lever', 'Social')
        ]
        cursor.executemany("INSERT INTO filters (filter_type, filter_value) VALUES (?, ?)", filters_data)

    cursor.execute("SELECT COUNT(*) FROM baseline_metrics")
    if cursor.fetchone()[0] == 0:
        baseline_data = [
            ('UK', 'AMAZON', 'PETCARE', 12000000.0, 960000, 25200000.0, 16800000.0, 2.10),
            ('US', 'WALMART', 'PETCARE', 21600000.0, 1728000, 45360000.0, 30240000.0, 2.10),
            ('GERMANY', 'TESCO', 'PETCARE', 14400000.0, 1152000, 30240000.0, 20160000.0, 2.10),
            ('FRANCE', 'TARGET', 'PETCARE', 10800000.0, 864000, 22680000.0, 15120000.0, 2.10)
        ]
        cursor.executemany(
            "INSERT INTO baseline_metrics (market, retailer, category, budget, volume, sales, nns, roi) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            baseline_data
        )

    cursor.execute("SELECT COUNT(*) FROM brand_shares")
    if cursor.fetchone()[0] == 0:
        shares_data = [
            ('Felix', 14.3),
            ('Gourmet', 14.3),
            ('Purina One', 14.3),
            ('Pro Plan', 14.3),
            ('Bakers', 14.3),
            ('Winalot', 14.3),
            ('Dentalife', 14.2)
        ]
        cursor.executemany("INSERT INTO brand_shares (brand_name, share_pct) VALUES (?, ?)", shares_data)

    conn.commit()
    conn.close()
    print("SQLite database initialized successfully at:", DB_PATH)

def fetch_filters_from_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT filter_type, filter_value FROM filters")
    rows = cursor.fetchall()
    conn.close()

    result = {
        "markets": [],
        "retailers": [],
        "categories": [],
        "brands": ["ALL"],
        "mediaLevers": []
    }
    for row in rows:
        ftype = row['filter_type']
        fval = row['filter_value']
        if ftype == 'market' and fval not in result["markets"]:
            result["markets"].append(fval)
        elif ftype == 'retailer' and fval not in result["retailers"]:
            result["retailers"].append(fval)
        elif ftype == 'category' and fval not in result["categories"]:
            result["categories"].append(fval)
        elif ftype == 'brand' and fval not in result["brands"]:
            result["brands"].append(fval)
        elif ftype == 'media_lever' and fval not in result["mediaLevers"]:
            result["mediaLevers"].append(fval)

    return result

def fetch_baseline_from_db(market='UK', retailer='AMAZON', category='PETCARE'):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT budget, volume, sales, nns, roi FROM baseline_metrics WHERE market = ? LIMIT 1",
        (market,)
    )
    row = cursor.fetchone()
    
    if not row:
        cursor.execute("SELECT budget, volume, sales, nns, roi FROM baseline_metrics WHERE market = 'UK' LIMIT 1")
        row = cursor.fetchone()

    cursor.execute("SELECT brand_name, share_pct FROM brand_shares")
    shares_rows = cursor.fetchall()
    conn.close()

    brand_shares = {r['brand_name']: r['share_pct'] for r in shares_rows}

    metrics = {
        "budget": row['budget'],
        "volume": row['volume'],
        "sales": row['sales'],
        "nns": row['nns'],
        "roi": row['roi']
    }

    return metrics, brand_shares

if __name__ == '__main__':
    init_db()
