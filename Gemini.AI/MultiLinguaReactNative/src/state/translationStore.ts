import create from 'zustand';

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

interface TranslationState {
  translations: Translation[];
  loading: boolean;
  error: string | null;
  setTranslations: (translations: Translation[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addTranslation: (translation: Translation) => void;
  updateTranslation: (id: number, updatedFields: Partial<Translation>) => void;
  deleteTranslation: (id: number) => void;
}

export const useTranslationStore = create<TranslationState>((set) => ({
  translations: [],
  loading: true,
  error: null,
  setTranslations: (translations) => set({ translations, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  addTranslation: (translation) => set((state) => ({ translations: [...state.translations, translation] })),
  updateTranslation: (id, updatedFields) =>
    set((state) => ({
      translations: state.translations.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)),
    })),
  deleteTranslation: (id) => set((state) => ({ translations: state.translations.filter((t) => t.id !== id) })),
}));
