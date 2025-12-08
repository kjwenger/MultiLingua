import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { speak } from '../services/tts';

interface Translation {
    id: number;
    english: string;
    german: string;
    french: string;
    italian: string;
    spanish: string;
    english_proposals: string;
    german_proposals: string;
    french_proposals: string;
    italian_proposals: string;
    spanish_proposals: string;
}

interface TranslationRowProps {
  translation: Translation;
  onUpdate: (id: number, updatedFields: Partial<Translation>) => void;
  onDelete: (id: number) => void;
  onTranslate: (id: number, language: 'english' | 'german' | 'french' | 'italian' | 'spanish') => void;
}

const TranslationRow: React.FC<TranslationRowProps> = ({ translation, onUpdate, onDelete, onTranslate }) => {
  const { colors } = useTheme();
  const [english, setEnglish] = useState(translation.english);
  const [german, setGerman] = useState(translation.german);
  const [french, setFrench] = useState(translation.french);
  const [italian, setItalian] = useState(translation.italian);
  const [spanish, setSpanish] = useState(translation.spanish);

  const handleBlur = (field: keyof Translation, value: string) => {
    onUpdate(translation.id, { [field]: value });
  };

  const handleSpeak = (text: string, language: 'en' | 'de' | 'fr' | 'it' | 'es') => {
      speak(text, language);
  }

  const styles = StyleSheet.create({
    container: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
      marginBottom: 10,
      borderRadius: 5,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 8,
      borderRadius: 5,
      color: colors.text,
      backgroundColor: colors.background,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={english}
          onChangeText={setEnglish}
          onBlur={() => handleBlur('english', english)}
          placeholder="English"
          placeholderTextColor={colors.text}
        />
        <Button title="T" onPress={() => onTranslate(translation.id, 'english')} color={colors.primary} />
        <Button title="S" onPress={() => handleSpeak(english, 'en')} color={colors.primary} />
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={german}
          onChangeText={setGerman}
          onBlur={() => handleBlur('german', german)}
          placeholder="German"
          placeholderTextColor={colors.text}
        />
         <Button title="T" onPress={() => onTranslate(translation.id, 'german')} color={colors.primary} />
         <Button title="S" onPress={() => handleSpeak(german, 'de')} color={colors.primary} />
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={french}
          onChangeText={setFrench}
          onBlur={() => handleBlur('french', french)}
          placeholder="French"
          placeholderTextColor={colors.text}
        />
        <Button title="T" onPress={() => onTranslate(translation.id, 'french')} color={colors.primary} />
        <Button title="S" onPress={() => handleSpeak(french, 'fr')} color={colors.primary} />
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={italian}
          onChangeText={setItalian}
          onBlur={() => handleBlur('italian', italian)}
          placeholder="Italian"
          placeholderTextColor={colors.text}
        />
        <Button title="T" onPress={() => onTranslate(translation.id, 'italian')} color={colors.primary} />
        <Button title="S" onPress={() => handleSpeak(italian, 'it')} color={colors.primary} />
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={spanish}
          onChangeText={setSpanish}
          onBlur={() => handleBlur('spanish', spanish)}
          placeholder="Spanish"
          placeholderTextColor={colors.text}
        />
        <Button title="T" onPress={() => onTranslate(translation.id, 'spanish')} color={colors.primary} />
        <Button title="S" onPress={() => handleSpeak(spanish, 'es')} color={colors.primary} />
      </View>
      <Button title="Delete" onPress={() => onDelete(translation.id)} color="red" />
    </View>
  );
};

export default TranslationRow;