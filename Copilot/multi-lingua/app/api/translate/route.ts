import { NextRequest, NextResponse } from 'next/server';
import { translateService } from '@/lib/translate';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const translations = await translateService.translateToAllLanguages(text);
    
    return NextResponse.json({
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
