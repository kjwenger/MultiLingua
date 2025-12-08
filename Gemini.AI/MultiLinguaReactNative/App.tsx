import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import TranslationScreen from './src/screens/TranslationScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { initializeTts } from './src/services/tts';

const App = () => {
    useEffect(() => {
        initializeTts();
    }, []);
    
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const AppContent = () => {
    const { isDarkMode } = useTheme();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <TranslationScreen />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;