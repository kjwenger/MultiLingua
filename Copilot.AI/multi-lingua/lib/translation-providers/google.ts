import axios from 'axios';
import { TranslationProvider } from './base';

export class GoogleProvider implements TranslationProvider {
  name = 'Google Translate';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async translate(text: string, source: string, target: string): Promise<{ translatedText: string; alternatives?: string[] }> {
    try {
      const response = await axios.post(
        'https://translation.googleapis.com/language/translate/v2',
        null,
        {
          params: {
            key: this.apiKey,
            q: text,
            source: source,
            target: target,
            format: 'text'
          },
          timeout: 10000
        }
      );

      return {
        translatedText: response.data.data.translations[0]?.translatedText || '',
        alternatives: []
      };
    } catch (error) {
      console.error(`Google Translate error (${source} -> ${target}):`, error);
      throw error;
    }
  }

  async isConfigured(): Promise<boolean> {
    return !!this.apiKey;
  }

  async testConnection(): Promise<boolean> {
    try {
      await axios.post(
        'https://translation.googleapis.com/language/translate/v2',
        null,
        {
          params: {
            key: this.apiKey,
            q: 'test',
            target: 'es'
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
