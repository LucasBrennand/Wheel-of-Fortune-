import Database from 'better-sqlite3';
const db = new Database('./server/data/vouchers.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS spins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    prize_id INTEGER,
    prize_label TEXT,
    coupon_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;