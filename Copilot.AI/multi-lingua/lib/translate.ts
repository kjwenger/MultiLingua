import axios from 'axios';

// LibreTranslate URL configuration with fallbacks for different environments
const getLibreTranslateUrl = () => {
  // 1. Use environment variable if set
  if (process.env.LIBRETRANSLATE_URL) {
    return process.env.LIBRETRANSLATE_URL;
  }
  
  // 2. For Docker Compose, use service name
  if (process.env.NODE_ENV === 'production' && process.env.DOCKER_COMPOSE) {
    return 'http://libretranslate:5000';
  }
  
  // 3. For standalone Docker container, try to reach host
  if (process.env.NODE_ENV === 'production') {
    return 'http://host.docker.internal:5000';
  }
  
  // 4. Default for local development
  return 'http://localhost:5000';
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
      const response = await axios.post(`${LIBRETRANSLATE_URL}/translate`, {
        q: text,
        source: source,
        target: target,
        format: 'text'
      });
      
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
    french: TranslationResult;
    italian: TranslationResult;
    spanish: TranslationResult;
  }> {
    const [french, italian, spanish] = await Promise.all([
      this.translateToFrench(text),
      this.translateToItalian(text),
      this.translateToSpanish(text)
    ]);

    return { french, italian, spanish };
  }
}

export const translateService = new LibreTranslateService();
