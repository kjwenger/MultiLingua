import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SettingsButton = () => {
  return (
    <TouchableOpacity style={styles.button} onPress={() => console.log('Settings pressed')}>
      <Text>Settings</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
});

export default SettingsButton;
