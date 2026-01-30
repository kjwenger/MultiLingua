import axios from 'axios';
import { TranslationProvider } from './base';

export class DeepLProvider implements TranslationProvider {
  name = 'DeepL';
  private apiKey: string;
  private isFree: boolean;

  constructor(apiKey: string, isFree: boolean = true) {
    this.apiKey = apiKey;
    this.isFree = isFree;
  }

  async translate(text: string, source: string, target: string): Promise<{ translatedText: string; alternatives?: string[] }> {
    try {
      const baseUrl = this.isFree ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
      const targetLang = target.toUpperCase();
      const sourceLang = source.toUpperCase();

      const response = await axios.post(
        `${baseUrl}/v2/translate`,
        null,
        {
          params: {
            auth_key: this.apiKey,
            text: text,
            source_lang: sourceLang,
            target_lang: targetLang
          },
          timeout: 10000
        }
      );

      return {
        translatedText: response.data.translations[0]?.text || '',
        alternatives: []
      };
    } catch (error) {
      console.error(`DeepL error (${source} -> ${target}):`, error);
      throw error;
    }
  }

  async isConfigured(): Promise<boolean> {
    return !!this.apiKey;
  }

  async testConnection(): Promise<boolean> {
    try {
      const baseUrl = this.isFree ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
      await axios.post(
        `${baseUrl}/v2/translate`,
        null,
        {
          params: {
            auth_key: this.apiKey,
            text: 'test',
            target_lang: 'ES'
          },
          timeout: 5000
        }
      );
      return true;
    } catch {
      return false;
    }
  }
}
