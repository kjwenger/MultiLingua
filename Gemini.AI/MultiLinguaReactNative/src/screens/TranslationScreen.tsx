import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useTranslationStore } from '../state/translationStore';
import {
  fetchTranslations,
  addTranslationToApi,
  updateTranslationInApi,
  deleteTranslationFromApi,
  translateText,
} from '../services/api';
import TranslationRow from '../components/TranslationRow';
import SettingsButton from '../components/SettingsButton';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const TranslationScreen = () => {
  const { translations, loading, error, updateTranslation, deleteTranslation } = useTranslationStore();
  const { colors } = useTheme();

  useEffect(() => {
    fetchTranslations();
  }, []);

  const handleAddTranslation = async () => {
    const newTranslationData = {
      english: 'New Translation',
      german: '',
      french: '',
      italian: '',
      spanish: '',
      english_proposals: '[]',
      german_proposals: '[]',
      french_proposals: '[]',
      italian_proposals: '[]',
      spanish_proposals: '[]',
    };
    const result = await addTranslationToApi(newTranslationData);
    if (result && result.id) {
        fetchTranslations();
    }
  };

  const handleUpdate = (id: number, updatedFields: Partial<any>) => {
    updateTranslation(id, updatedFields);
    updateTranslationInApi(id, updatedFields);
  };

  const handleDelete = (id: number) => {
    deleteTranslation(id);
    deleteTranslationFromApi(id);
  };

  const handleTranslate = async (id: number, language: 'english' | 'german' | 'french' | 'italian' | 'spanish') => {
    const translation = translations.find(t => t.id === id);
    if (!translation) return;

    const textToTranslate = translation[language];
    if (!textToTranslate) return;

    const translationResult = await translateText(textToTranslate, language);
    if (translationResult) {
        const updatedFields: any = {};
        if (translationResult.english) {
            updatedFields.english = translationResult.english.translatedText;
            updatedFields.english_proposals = JSON.stringify(translationResult.english.alternatives || []);
        }
        if (translationResult.german) {
            updatedFields.german = translationResult.german.translatedText;
            updatedFields.german_proposals = JSON.stringify(translationResult.german.alternatives || []);
        }
        if (translationResult.french) {
            updatedFields.french = translationResult.french.translatedText;
            updatedFields.french_proposals = JSON.stringify(translationResult.french.alternatives || []);
        }
        if (translationResult.italian) {
            updatedFields.italian = translationResult.italian.translatedText;
            updatedFields.italian_proposals = JSON.stringify(translationResult.italian.alternatives || []);
        }
        if (translationResult.spanish) {
            updatedFields.spanish = translationResult.spanish.translatedText;
            updatedFields.spanish_proposals = JSON.stringify(translationResult.spanish.alternatives || []);
        }

        handleUpdate(id, updatedFields);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: colors.background,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    headerButtons: {
      flexDirection: 'row',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{color: colors.text}}>Loading translations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Retry" onPress={fetchTranslations} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Multi-Lingua</Text>
        <View style={styles.headerButtons}>
            <SettingsButton />
            <ThemeToggle />
        </View>
      </View>
      <FlatList
        data={translations}
        renderItem={({ item }) => (
            <TranslationRow
                translation={item}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onTranslate={handleTranslate}
            />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Add New Translation" onPress={handleAddTranslation} color={colors.primary} />
    </View>
  );
};

export default TranslationScreen;
