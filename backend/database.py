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

    # 5. Create users table for Auth System
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            role TEXT DEFAULT 'User',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 6. Create optimization_sessions table for saving run inputs & outputs
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS optimization_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            -- Filter Inputs
            market TEXT,
            retailer TEXT,
            category TEXT,
            brand TEXT,
            media_lever TEXT,
            
            -- Objective & Target Inputs
            objective TEXT,
            sales_kpi TEXT,
            target_mode TEXT,
            input_budget REAL,
            input_sales_target REAL,
            target_sub_mode TEXT,
            
            -- Guardrails (Min & Max bounds)
            use_guardrails INTEGER,
            guardrails_data TEXT,
            
            -- Optimized Output Results
            opt_budget REAL,
            opt_budget_pct_change REAL,
            opt_volume INTEGER,
            opt_volume_pct_change REAL,
            opt_sales REAL,
            opt_sales_pct_change REAL,
            opt_nns REAL,
            opt_nns_pct_change REAL,
            opt_roi REAL,
            opt_roi_pct_change REAL
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

    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        from werkzeug.security import generate_password_hash
        admin_pwd_hash = generate_password_hash("password123")
        cursor.execute(
            "INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)",
            ("admin", "admin@purina.com", admin_pwd_hash, "Admin User", "Admin")
        )

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

def create_user(username, email, password_hash, full_name="", role="User"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)",
        (username, email, password_hash, full_name, role)
    )
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return user_id

def get_user_by_email_or_username(identifier):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, username, email, password_hash, full_name, role FROM users WHERE username = ? OR email = ?",
        (identifier, identifier)
    )
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?",
        (user_id,)
    )
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

import json

def save_optimization_session(session_data):
    conn = get_db_connection()
    cursor = conn.cursor()

    guardrails_json = json.dumps(session_data.get('guardrailsData', {}))

    cursor.execute('''
        INSERT INTO optimization_sessions (
            user_id, market, retailer, category, brand, media_lever,
            objective, sales_kpi, target_mode, input_budget, input_sales_target, target_sub_mode,
            use_guardrails, guardrails_data,
            opt_budget, opt_budget_pct_change, opt_volume, opt_volume_pct_change,
            opt_sales, opt_sales_pct_change, opt_nns, opt_nns_pct_change,
            opt_roi, opt_roi_pct_change
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        session_data.get('userId'),
        session_data.get('market'),
        session_data.get('retailer'),
        session_data.get('category'),
        session_data.get('brand'),
        session_data.get('mediaLever'),
        session_data.get('objective'),
        session_data.get('salesKpi'),
        session_data.get('targetMode'),
        session_data.get('inputBudget'),
        session_data.get('inputSalesTarget'),
        session_data.get('targetSubMode'),
        1 if session_data.get('useGuardrails') else 0,
        guardrails_json,
        session_data.get('optBudget'),
        session_data.get('optBudgetPctChange'),
        session_data.get('optVolume'),
        session_data.get('optVolumePctChange'),
        session_data.get('optSales'),
        session_data.get('optSalesPctChange'),
        session_data.get('optNns'),
        session_data.get('optNnsPctChange'),
        session_data.get('optRoi'),
        session_data.get('optRoiPctChange')
    ))

    session_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return session_id

def get_optimization_sessions(user_id=None, limit=20):
    conn = get_db_connection()
    cursor = conn.cursor()

    if user_id:
        cursor.execute(
            "SELECT * FROM optimization_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
            (user_id, limit)
        )
    else:
        cursor.execute(
            "SELECT * FROM optimization_sessions ORDER BY created_at DESC LIMIT ?",
            (limit,)
        )

    rows = cursor.fetchall()
    conn.close()

    sessions = []
    for r in rows:
        item = dict(r)
        if item.get('guardrails_data'):
            try:
                item['guardrails_data'] = json.loads(item['guardrails_data'])
            except Exception:
                pass
        sessions.append(item)

    return sessions

if __name__ == '__main__':
    init_db()
