import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { resetTranslationService } from '@/lib/translation-providers';

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
    
    db.all('SELECT key, value FROM settings', (err, rows: Array<{ key: string; value: string }> | undefined) => {
      db.close();
      
      if (err) {
        console.error('Error fetching settings:', err);
        resolve(NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 }));
      } else {
        const settings: Record<string, string> = {};
        rows?.forEach(row => {
          settings[row.key] = row.value;
        });
        
        // Set defaults for missing values
        if (!settings.libretranslate_url) {
          settings.libretranslate_url = process.env.LIBRETRANSLATE_URL || 'http://localhost:5000';
        }
        if (!settings.active_provider) {
          settings.active_provider = 'libretranslate';
        }
        
        resolve(NextResponse.json(settings));
      }
    });
  });
}

export async function POST(request: NextRequest) {
  return new Promise(async (resolve) => {
    const body = await request.json();
    
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO settings (key, value) 
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
    
    let hasError = false;
    let count = 0;
    const total = Object.keys(body).length;
    
    for (const [key, value] of Object.entries(body)) {
      stmt.run(key, String(value), (err) => {
        if (err) {
          hasError = true;
          console.error(`Error saving setting ${key}:`, err);
        }
        
        count++;
        if (count === total) {
          stmt.finalize();
          db.close();
          
          // Reset translation service to pick up new settings
          resetTranslationService();
          
          if (hasError) {
            resolve(NextResponse.json({ error: 'Failed to save some settings' }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ success: true, ...body }));
          }
        }
      });
    }
  });
}
