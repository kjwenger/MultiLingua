import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

function isDocker() {
  try {
    return fs.existsSync('/.dockerenv') || (fs.existsSync('/proc/1/cgroup') && fs.readFileSync('/proc/1/cgroup', 'utf8').includes('docker'));
  } catch {
    return false;
  }
}

const dataDir = process.env.DATA_DIR
  ? process.env.DATA_DIR
  : isDocker()
    ? '/app/data'
    : path.join(process.cwd(), 'app', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'translations.db');

function getDb(): sqlite3.Database {
  const db = new sqlite3.Database(dbPath);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
  
  return db;
}

export async function GET() {
  return new Promise((resolve) => {
    const db = getDb();
    
    db.get('SELECT value FROM settings WHERE key = ?', ['libretranslate_url'], (err, row: { value: string } | undefined) => {
      db.close();
      
      if (err) {
        console.error('Error fetching settings:', err);
        resolve(NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 }));
      } else {
        const defaultUrl = process.env.LIBRETRANSLATE_URL || 'http://localhost:5432';
        resolve(NextResponse.json({ 
          libretranslate_url: row?.value || defaultUrl
        }));
      }
    });
  });
}

export async function POST(request: NextRequest) {
  return new Promise(async (resolve) => {
    const body = await request.json();
    const { libretranslate_url } = body;

    if (!libretranslate_url) {
      resolve(NextResponse.json({ error: 'libretranslate_url is required' }, { status: 400 }));
      return;
    }

    const db = getDb();
    
    db.run(`
      INSERT INTO settings (key, value) 
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `, ['libretranslate_url', libretranslate_url], (err) => {
      db.close();
      
      if (err) {
        console.error('Error saving settings:', err);
        resolve(NextResponse.json({ error: 'Failed to save settings' }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ success: true, libretranslate_url }));
      }
    });
  });
}
