import axios from 'axios';
import { useTranslationStore } from '../state/translationStore';

// TODO: Replace with your actual API base URL
const API_BASE_URL = 'http://localhost:3456/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTranslations = async () => {
  const { setTranslations, setError } = useTranslationStore.getState();
  try {
    const response = await api.get('/translations');
    setTranslations(response.data);
  } catch (error) {
    console.error('Error fetching translations:', error);
    setError('Failed to load translations');
  }
};

export const translateText = async (text: string, sourceLanguage: 'en' | 'de' | 'fr' | 'it' | 'es' = 'en') => {
  try {
    const response = await api.post('/translate', { text, sourceLanguage });
    return response.data;
  } catch (error) {
    console.error('Translation error:', error);
    return null;
  }
};

export const updateTranslationInApi = async (id: number, updatedFields: any) => {
  try {
    await api.put('/translations', { id, ...updatedFields });
  } catch (error) {
    console.error('Error updating translation:', error);
  }
};

export const addTranslationToApi = async (newTranslation: any) => {
  try {
    const response = await api.post('/translations', newTranslation);
    return response.data;
  } catch (error) {
    console.error('Error adding translation:', error);
    return null;
  }
};

export const deleteTranslationFromApi = async (id: number) => {
  try {
    await api.delete(`/translations?id=${id}`);
  } catch (error) {
    console.error('Error deleting translation:', error);
  }
};
