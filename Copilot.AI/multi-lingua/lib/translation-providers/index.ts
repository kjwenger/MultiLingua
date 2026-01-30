import { TranslationProvider, ProviderConfig } from './base';
import { LibreTranslateProvider } from './libretranslate';
import { MyMemoryProvider } from './mymemory';
import { DeepLProvider } from './deepl';
import { GoogleProvider } from './google';
import { AzureProvider } from './azure';
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

export class TranslationService {
  private providers: Map<string, TranslationProvider> = new Map();
  private fallbackOrder: string[] = [];

  async initialize() {
    console.log('=== TranslationService.initialize() START ===');
    const configs = await this.loadProviderConfigs();
    console.log(`Loaded ${configs.length} provider configs:`, JSON.stringify(configs));
    
    for (const config of configs) {
      console.log(`Checking config for ${config.type}: enabled=${config.enabled}, apiUrl=${config.apiUrl}`);
      if (!config.enabled) {
        console.log(`  -> Skipping ${config.type} (not enabled)`);
        continue;
      }

      let provider: TranslationProvider | null = null;

      switch (config.type) {
        case 'libretranslate':
          if (config.apiUrl) {
            console.log(`  -> Creating LibreTranslateProvider with URL: ${config.apiUrl}`);
            provider = new LibreTranslateProvider(config.apiUrl, config.apiKey);
            console.log(`  -> LibreTranslate provider created`);
          } else {
            console.log(`  -> LibreTranslate skipped (no apiUrl)`);
          }
          break;
        case 'mymemory':
          console.log(`  -> Creating MyMemoryProvider`);
          provider = new MyMemoryProvider();
          break;
        case 'deepl':
          if (config.apiKey) {
            console.log(`  -> Creating DeepLProvider`);
            provider = new DeepLProvider(config.apiKey, true);
          } else {
            console.log(`  -> DeepL skipped (no apiKey)`);
          }
          break;
        case 'google':
          if (config.apiKey) {
            console.log(`  -> Creating GoogleProvider`);
            provider = new GoogleProvider(config.apiKey);
          } else {
            console.log(`  -> Google skipped (no apiKey)`);
          }
          break;
        case 'azure':
          if (config.apiKey) {
            console.log(`  -> Creating AzureProvider`);
            provider = new AzureProvider(config.apiKey, config.region);
          } else {
            console.log(`  -> Azure skipped (no apiKey)`);
          }
          break;
      }

      if (provider) {
        this.providers.set(config.type, provider);
        console.log(`  -> Provider ${config.type} registered successfully`);
      } else {
        console.log(`  -> Provider ${config.type} NOT registered (null)`);
      }
    }

    console.log(`=== Total providers registered: ${this.providers.size} ===`);
    console.log(`Provider types: ${Array.from(this.providers.keys()).join(', ')}`);
  }

  private async loadProviderConfigs(): Promise<ProviderConfig[]> {
    console.log('=== loadProviderConfigs() START ===');
    return new Promise((resolve) => {
      const db = new sqlite3.Database(dbPath);
      console.log(`Database path: ${dbPath}`);
      
      db.run(`
        CREATE TABLE IF NOT EXISTS provider_configs (
          type TEXT PRIMARY KEY,
          enabled INTEGER DEFAULT 1,
          api_key TEXT,
          api_url TEXT,
          region TEXT
        )
      `, (err) => {
        if (err) console.error('Error creating provider_configs table:', err);
        else console.log('provider_configs table ready');
      });

      db.all('SELECT * FROM provider_configs', (err, rows: any[]) => {
        console.log('Query result - err:', err, 'rows:', rows);
        if (err || !rows || rows.length === 0) {
          const defaultUrl = this.getDefaultLibreTranslateUrl();
          console.log(`No configs found, creating default LibreTranslate with URL: ${defaultUrl}`);
          const defaultConfigs: ProviderConfig[] = [
            { type: 'libretranslate', enabled: true, apiUrl: defaultUrl },
            { type: 'mymemory', enabled: false }
          ];
          
          // Insert default LibreTranslate config into database
          db.run(`
            INSERT OR REPLACE INTO provider_configs (type, enabled, api_url) 
            VALUES (?, ?, ?)
          `, ['libretranslate', 1, defaultUrl], (insertErr) => {
            if (insertErr) console.error('Error inserting default config:', insertErr);
            else console.log('Default LibreTranslate config inserted');
            db.close();
            console.log('Returning default configs:', JSON.stringify(defaultConfigs));
            resolve(defaultConfigs);
          });
        } else {
          const configs = rows.map(row => ({
            type: row.type as any,
            enabled: row.enabled === 1,
            apiKey: row.api_key,
            apiUrl: row.api_url,
            region: row.region
          }));
          
          // Fix any libretranslate entries with null URL
          const libreConfig = configs.find(c => c.type === 'libretranslate');
          if (libreConfig && !libreConfig.apiUrl) {
            const defaultUrl = this.getDefaultLibreTranslateUrl();
            console.log(`LibreTranslate has null URL, updating to: ${defaultUrl}`);
            libreConfig.apiUrl = defaultUrl;
            db.run(`UPDATE provider_configs SET api_url = ? WHERE type = ?`, [defaultUrl, 'libretranslate']);
          }
          
          console.log('Loaded configs from DB:', JSON.stringify(configs));
          db.close();
          resolve(configs);
        }
      });
    });
  }

  private async loadFallbackOrder(): Promise<void> {
    return new Promise((resolve) => {
      const db = new sqlite3.Database(dbPath);
      
      db.run(`
        CREATE TABLE IF NOT EXISTS provider_fallback (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          provider_type TEXT NOT NULL,
          priority INTEGER NOT NULL
        )
      `);

      db.all('SELECT provider_type FROM provider_fallback ORDER BY priority ASC', (err, rows: any[]) => {
        if (!err && rows && rows.length > 0) {
          this.fallbackOrder = rows.map(row => row.provider_type);
        } else {
          this.fallbackOrder = ['libretranslate', 'mymemory'];
          
          // Insert default fallback order into database
          db.run('INSERT INTO provider_fallback (provider_type, priority) VALUES (?, ?)', ['libretranslate', 0]);
          db.run('INSERT INTO provider_fallback (provider_type, priority) VALUES (?, ?)', ['mymemory', 1]);
        }
        db.close();
        resolve();
      });
    });
  }

  private getDefaultLibreTranslateUrl(): string {
    if (process.env.LIBRETRANSLATE_URL) {
      return process.env.LIBRETRANSLATE_URL;
    }
    if (process.env.DOCKER_COMPOSE) {
      return 'http://libretranslate:5000';
    }
    if (isDocker()) {
      return 'http://host.docker.internal:5432';
    }
    return 'http://localhost:5432';
  }

  private async translateWithProvider(provider: TranslationProvider, text: string, source: string, target: string): Promise<{ translatedText: string; alternatives: string[] }> {
    try {
      const result = await provider.translate(text, source, target);
      return { translatedText: result.translatedText, alternatives: result.alternatives || [] };
    } catch (error) {
      throw error;
    }
  }

  async translate(text: string, source: string, target: string): Promise<{ translatedText: string; alternatives: string[] }> {
    for (const providerType of this.fallbackOrder) {
      const provider = this.providers.get(providerType);
      if (!provider) continue;

      try {
        console.log(`Trying provider: ${provider.name}`);
        const result = await this.translateWithProvider(provider, text, source, target);
        console.log(`Success with ${provider.name}: "${result.translatedText}"`);
        return result;
      } catch (error) {
        console.log(`${provider.name} failed, trying next provider...`);
      }
    }

    throw new Error('All translation providers failed');
  }

  async translateFromLanguage(text: string, sourceLanguage: 'en' | 'de' | 'fr' | 'it' | 'es'): Promise<{
    english?: { translatedText: string; alternatives?: string[] };
    german?: { translatedText: string; alternatives?: string[] };
    french?: { translatedText: string; alternatives?: string[] };
    italian?: { translatedText: string; alternatives?: string[] };
    spanish?: { translatedText: string; alternatives?: string[] };
  }> {
    const results: any = {};
    const targets = [];
    
    if (sourceLanguage !== 'en') targets.push({ key: 'english', code: 'en' });
    if (sourceLanguage !== 'de') targets.push({ key: 'german', code: 'de' });
    if (sourceLanguage !== 'fr') targets.push({ key: 'french', code: 'fr' });
    if (sourceLanguage !== 'it') targets.push({ key: 'italian', code: 'it' });
    if (sourceLanguage !== 'es') targets.push({ key: 'spanish', code: 'es' });

    const translations = await Promise.all(
      targets.map(async (target) => {
        const result = await this.translate(text, sourceLanguage, target.code);
        return { key: target.key, result };
      })
    );

    translations.forEach(({ key, result }) => {
      results[key] = result;
    });

    return results;
  }
}

let translationServiceInstance: TranslationService | null = null;

export async function getTranslationService(): Promise<TranslationService> {
  if (!translationServiceInstance) {
    translationServiceInstance = new TranslationService();
    await translationServiceInstance.initialize();
  }
  return translationServiceInstance;
}
