import axios from 'axios';

// LibreTranslate URL configuration with fallbacks for different environments
const getLibreTranslateUrl = () => {
  // 1. Use environment variable if set, default to localhost:5000
  if (process.env.LIBRETRANSLATE_URL) {
    return process.env.LIBRETRANSLATE_URL;
  }

  // 2. Detect Docker environment
  const fs = require('fs');
  function isDocker() {
    try {
      return fs.existsSync('/.dockerenv') || (fs.existsSync('/proc/1/cgroup') && fs.readFileSync('/proc/1/cgroup', 'utf8').includes('docker'));
    } catch {
      return false;
    }
  }

  // 3. Use Docker Compose service name if DOCKER_COMPOSE env is set
  if (process.env.DOCKER_COMPOSE) {
    return 'http://libretranslate:5432';
  }

  // 4. Use host.docker.internal if running in Docker
  if (isDocker()) {
    return 'http://host.docker.internal:5432';
  }

  // 5. Default for local development
  return 'http://localhost:5432';
};

const LIBRETRANSLATE_URL = getLibreTranslateUrl();

// Log the LibreTranslate URL being used (helpful for debugging)
console.log(`Using LibreTranslate URL: ${LIBRETRANSLATE_URL}`);

export interface TranslationResult {
  translatedText: string;
  alternatives?: string[];
}

export class LibreTranslateService {
  private async translate(text: string, source: string, target: string): Promise<string> {
    try {
      const payload: any = {
        q: text,
        source: source,
        target: target,
        format: 'text'
      };
      // Add api_key if set in environment
      if (process.env.LIBRETRANSLATE_API_KEY) {
        payload.api_key = process.env.LIBRETRANSLATE_API_KEY;
      }
      console.log('Sending payload to LibreTranslate:', JSON.stringify(payload));
      const response = await axios.post(
        `${LIBRETRANSLATE_URL}/translate`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data.translatedText || '';
    } catch (error) {
      console.error(`Translation error (${source} -> ${target}):`, error);
      return '';
    }
  }

  private async getAlternatives(text: string, source: string, target: string): Promise<string[]> {
    // LibreTranslate doesn't provide alternatives by default, so we'll generate
    // variations by modifying the source text slightly and translating
    const alternatives: string[] = [];
    
    try {
      // Try different variations of the input text to get alternative translations
      const variations = [
        text,
        text.toLowerCase(),
        text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
        `the ${text}`,
        `a ${text}`
      ];

      for (const variation of variations) {
        try {
          const result = await this.translate(variation, source, target);
          if (result && !alternatives.includes(result)) {
            alternatives.push(result);
          }
        } catch (error) {
          // Continue with next variation
        }
      }
    } catch (error) {
      console.error('Error getting alternatives:', error);
    }

    return alternatives.slice(0, 5); // Return up to 5 alternatives
  }

  public async translateToGerman(text: string): Promise<TranslationResult> {
    const translatedText = await this.translate(text, 'en', 'de');
    const alternatives = await this.getAlternatives(text, 'en', 'de');
    
    return {
      translatedText,
      alternatives
    };
  }

  public async translateToFrench(text: string): Promise<TranslationResult> {
    const translatedText = await this.translate(text, 'en', 'fr');
    const alternatives = await this.getAlternatives(text, 'en', 'fr');
    
    return {
      translatedText,
      alternatives
    };
  }

  public async translateToItalian(text: string): Promise<TranslationResult> {
    const translatedText = await this.translate(text, 'en', 'it');
    const alternatives = await this.getAlternatives(text, 'en', 'it');
    
    return {
      translatedText,
      alternatives
    };
  }

  public async translateToSpanish(text: string): Promise<TranslationResult> {
    const translatedText = await this.translate(text, 'en', 'es');
    const alternatives = await this.getAlternatives(text, 'en', 'es');
    
    return {
      translatedText,
      alternatives
    };
  }

  public async translateToAllLanguages(text: string): Promise<{
    german: TranslationResult;
    french: TranslationResult;
    italian: TranslationResult;
    spanish: TranslationResult;
  }> {
    const [german, french, italian, spanish] = await Promise.all([
      this.translateToGerman(text),
      this.translateToFrench(text),
      this.translateToItalian(text),
      this.translateToSpanish(text)
    ]);

    return { german, french, italian, spanish };
  }
}

export const translateService = new LibreTranslateService();
