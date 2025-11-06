import { NextRequest, NextResponse } from 'next/server';
import { translateService } from '@/lib/translate';

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLanguage } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // If sourceLanguage is provided, translate from that language to all others
    if (sourceLanguage) {
      const translations = await translateService.translateFromLanguage(text, sourceLanguage);
      
      const response: any = {};
      if (translations.english) {
        response.english = {
          translation: translations.english.translatedText,
          alternatives: translations.english.alternatives || []
        };
      }
      if (translations.german) {
        response.german = {
          translation: translations.german.translatedText,
          alternatives: translations.german.alternatives || []
        };
      }
      if (translations.french) {
        response.french = {
          translation: translations.french.translatedText,
          alternatives: translations.french.alternatives || []
        };
      }
      if (translations.italian) {
        response.italian = {
          translation: translations.italian.translatedText,
          alternatives: translations.italian.alternatives || []
        };
      }
      if (translations.spanish) {
        response.spanish = {
          translation: translations.spanish.translatedText,
          alternatives: translations.spanish.alternatives || []
        };
      }
      
      return NextResponse.json(response);
    }

    // Default: translate from English to all other languages
    const translations = await translateService.translateToAllLanguages(text);
    
    return NextResponse.json({
      german: {
        translation: translations.german.translatedText,
        alternatives: translations.german.alternatives || []
      },
      french: {
        translation: translations.french.translatedText,
        alternatives: translations.french.alternatives || []
      },
      italian: {
        translation: translations.italian.translatedText,
        alternatives: translations.italian.alternatives || []
      },
      spanish: {
        translation: translations.spanish.translatedText,
        alternatives: translations.spanish.alternatives || []
      }
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
