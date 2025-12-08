import Tts from 'react-native-tts';

Tts.setDefaultRate(0.5);

export const speak = (text: string, language: 'en' | 'de' | 'fr' | 'it' | 'es') => {
  const languageCode = `${language}-${language.toUpperCase()}`;
  Tts.setDefaultLanguage(languageCode);
  Tts.speak(text);
};

export const initializeTts = () => {
    Tts.getInitStatus().then(() => {
        // TTS is initialized
    }, (err) => {
        if (err.code === 'no_engine') {
            Tts.requestInstallEngine();
        }
    });
}
