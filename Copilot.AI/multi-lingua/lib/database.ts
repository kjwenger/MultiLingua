import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Use /app/data for Docker, fall back to current directory for local development
const dataDir = process.env.NODE_ENV === 'production' 
  ? '/app/data' 
  : process.cwd();

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'translations.db');

export interface Translation {
  id: number;
  english: string;
  french: string;
  italian: string;
  spanish: string;
  french_proposals: string;
  italian_proposals: string;
  spanish_proposals: string;
  created_at: string;
  updated_at: string;
}

export class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        english TEXT NOT NULL,
        french TEXT,
        italian TEXT,
        spanish TEXT,
        french_proposals TEXT,
        italian_proposals TEXT,
        spanish_proposals TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableQuery, (err: Error | null) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Database initialized successfully');
      }
    });
  }

  public getAllTranslations(): Promise<Translation[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM translations ORDER BY english ASC', (err: Error | null, rows: Translation[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  public addTranslation(data: {
    english: string;
    french?: string;
    italian?: string;
    spanish?: string;
    french_proposals?: string;
    italian_proposals?: string;
    spanish_proposals?: string;
  }): Promise<number> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO translations 
        (english, french, italian, spanish, french_proposals, italian_proposals, spanish_proposals)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(query, [
        data.english,
        data.french || '',
        data.italian || '',
        data.spanish || '',
        data.french_proposals || '',
        data.italian_proposals || '',
        data.spanish_proposals || ''
      ], function(this: sqlite3.RunResult, err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID as number);
        }
      });
    });
  }

  public updateTranslation(id: number, data: {
    english?: string;
    french?: string;
    italian?: string;
    spanish?: string;
    french_proposals?: string;
    italian_proposals?: string;
    spanish_proposals?: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const fields: string[] = [];
      const values: any[] = [];
      
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        if (value !== undefined) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      });
      
      if (fields.length === 0) {
        resolve();
        return;
      }
      
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      const query = `UPDATE translations SET ${fields.join(', ')} WHERE id = ?`;
      
      this.db.run(query, values, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public deleteTranslation(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM translations WHERE id = ?', [id], (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public close() {
    this.db.close();
  }
}

export const database = new Database();
