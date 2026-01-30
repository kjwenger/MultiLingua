import axios from 'axios';
import { TranslationProvider } from './base';

export class MyMemoryProvider implements TranslationProvider {
  name = 'MyMemory';

  async translate(text: string, source: string, target: string): Promise<{ translatedText: string; alternatives?: string[] }> {
    try {
      const response = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: text,
          langpair: `${source}|${target}`
        },
        timeout: 10000
      });

      return {
        translatedText: response.data.responseData.translatedText || '',
        alternatives: []
      };
    } catch (error) {
      console.error(`MyMemory error (${source} -> ${target}):`, error);
      throw error;
    }
  }

  async isConfigured(): Promise<boolean> {
    return true;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get('https://api.mymemory.translated.net/get', {
        params: { q: 'test', langpair: 'en|es' },
        timeout: 5000
      });
      return !!response.data.responseData;
    } catch {
      return false;
    }
  }
}
