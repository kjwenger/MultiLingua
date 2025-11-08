'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { SettingsButton } from '../components/SettingsButton';
import { playTextToSpeech } from '../lib/tts';

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

interface TranslationProposals {
  translation: string;
  alternatives: string[];
}

export default function Home() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translatingIds, setTranslatingIds] = useState<Set<number>>(new Set());
  const [ttsPlayingIds, setTtsPlayingIds] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      setError(null);
      const response = await fetch('/api/translations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTranslations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching translations:', error);
      setError('Failed to load translations');
      setTranslations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    
    const sorted = [...translations].sort((a, b) => {
      if (newOrder === 'asc') {
        return a.english.localeCompare(b.english);
      } else {
        return b.english.localeCompare(a.english);
      }
    });
    
    setTranslations(sorted);
  };

  const translateText = async (text: string, sourceLanguage?: 'en' | 'de' | 'fr' | 'it' | 'es') => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, sourceLanguage }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Translation error:', error);
      return null;
    }
  };

  const handleTranslateFromLanguage = async (id: number, language: 'english' | 'german' | 'french' | 'italian' | 'spanish') => {
    const translation = translations.find(t => t.id === id);
    if (!translation) return;

    const sourceText = translation[language];
    if (!sourceText?.trim()) return;

    const languageCodeMap = {
      english: 'en',
      german: 'de',
      french: 'fr',
      italian: 'it',
      spanish: 'es'
    };

    setTranslatingIds(prev => new Set(prev).add(id));

    try {
      const translationResult = await translateText(sourceText, languageCodeMap[language] as any);
      if (translationResult) {
        const updatedTranslation: any = {};
        
        if (translationResult.english) {
          updatedTranslation.english = translationResult.english.translation;
          updatedTranslation.english_proposals = JSON.stringify(translationResult.english.alternatives);
        }
        if (translationResult.german) {
          updatedTranslation.german = translationResult.german.translation;
          updatedTranslation.german_proposals = JSON.stringify(translationResult.german.alternatives);
        }
        if (translationResult.french) {
          updatedTranslation.french = translationResult.french.translation;
          updatedTranslation.french_proposals = JSON.stringify(translationResult.french.alternatives);
        }
        if (translationResult.italian) {
          updatedTranslation.italian = translationResult.italian.translation;
          updatedTranslation.italian_proposals = JSON.stringify(translationResult.italian.alternatives);
        }
        if (translationResult.spanish) {
          updatedTranslation.spanish = translationResult.spanish.translation;
          updatedTranslation.spanish_proposals = JSON.stringify(translationResult.spanish.alternatives);
        }

        await fetch('/api/translations', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, ...updatedTranslation }),
        });

        setTranslations(prev => prev.map(t => 
          t.id === id ? { ...t, ...updatedTranslation } : t
        ));
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleEnglishChange = async (id: number, value: string) => {
    // Update the local state immediately
    setTranslations(prev => prev.map(t => 
      t.id === id ? { ...t, english: value } : t
    ));

    // Update the database with just the English text
    await fetch('/api/translations', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, english: value }),
    });
  };

  const handleTranslationChange = async (id: number, field: string, value: string) => {
    // Update local state
    setTranslations(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));

    // Update database
    await fetch('/api/translations', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, [field]: value }),
    });
  };

  const handleTTS = async (id: number, language: 'english' | 'german' | 'french' | 'italian' | 'spanish', text: string) => {
    const ttsId = `${id}-${language}`;
    
    if (ttsPlayingIds.has(ttsId)) {
      return; // Already playing
    }

    setTtsPlayingIds(prev => new Set(prev).add(ttsId));
    
    try {
      await playTextToSpeech(text, language);
    } catch (error) {
      console.error('TTS error:', error);
    } finally {
      setTtsPlayingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(ttsId);
        return newSet;
      });
    }
  };

  const addNewRow = async () => {
    try {
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          english: '',
          german: '',
          french: '',
          italian: '',
          spanish: '',
          english_proposals: '[]',
          german_proposals: '[]',
          french_proposals: '[]',
          italian_proposals: '[]',
          spanish_proposals: '[]',
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchTranslations();
      }
    } catch (error) {
      console.error('Error adding new row:', error);
    }
  };

  const deleteRow = async (id: number) => {
    try {
      await fetch(`/api/translations?id=${id}`, {
        method: 'DELETE',
      });
      setTranslations(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  const getProposals = (proposalsJson: string): string[] => {
    try {
      return JSON.parse(proposalsJson || '[]');
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="text-xl text-gray-900 dark:text-gray-100 mb-4">Loading translations...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="text-xl text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button 
            onClick={fetchTranslations}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg transition-colors duration-200">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Multi-Lingua Translation</h1>
              <div className="flex items-center space-x-4">
                <SettingsButton />
                <ThemeToggle />
                <button
                  onClick={addNewRow}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                  Add New Translation
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700" style={{ minWidth: '650px' }}>
              <colgroup>
                <col style={{ minWidth: '140px' }} />
                <col style={{ minWidth: '140px' }} />
                <col style={{ minWidth: '140px' }} />
                <col style={{ minWidth: '140px' }} />
                <col style={{ minWidth: '140px' }} />
                <col style={{ width: '60px' }} />
              </colgroup>
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    onClick={handleSort}
                  >
                    English {sortOrder === 'asc' ? '↑' : '↓'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    German
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    French
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Italian
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Spanish
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {translations.map((translation) => (
                  <tr key={translation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-start gap-2">
                        <textarea
                          value={translation.english}
                          onChange={(e) => handleEnglishChange(translation.id, e.target.value)}
                          className="flex-1 min-w-[130px] p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                          rows={2}
                          placeholder="Enter English text"
                        />
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleTranslateFromLanguage(translation.id, 'english')}
                            disabled={!translation.english?.trim() || translatingIds.has(translation.id)}
                            className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                            title="Translate from English to all languages"
                          >
                            {translatingIds.has(translation.id) ? (
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleTTS(translation.id, 'english', translation.english)}
                            disabled={!translation.english.trim() || ttsPlayingIds.has(`${translation.id}-english`)}
                            className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                            title="Play English audio"
                          >
                          {ttsPlayingIds.has(`${translation.id}-english`) ? (
                            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776l-4.146-3.117H2a1 1 0 01-1-1V7.24a1 1 0 011-1h2.237l4.146-3.116a1 1 0 011.617.776zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd"/>
                            </svg>
                          )}
                        </button>
                        </div>
                      </div>
                      {getProposals(translation.english_proposals || '[]').length > 0 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          <strong>Suggestions:</strong>
                          <div className="grid grid-cols-2 gap-2">
                            <ul className="list-disc list-inside">
                              {getProposals(translation.english_proposals || '[]').slice(0, 5).map((proposal, idx) => (
                                <li 
                                  key={idx} 
                                  className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                  onClick={() => handleTranslationChange(translation.id, 'english', proposal)}
                                >
                                  {proposal}
                                </li>
                              ))}
                            </ul>
                            {getProposals(translation.english_proposals || '[]').length > 5 && (
                              <ul className="list-disc list-inside">
                                {getProposals(translation.english_proposals || '[]').slice(5, 10).map((proposal, idx) => (
                                  <li 
                                    key={idx + 5} 
                                    className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                    onClick={() => handleTranslationChange(translation.id, 'english', proposal)}
                                  >
                                    {proposal}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <textarea
                            value={translation.german || ''}
                            onChange={(e) => handleTranslationChange(translation.id, 'german', e.target.value)}
                            className="flex-1 min-w-[130px] p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                            rows={2}
                            placeholder="German translation"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleTranslateFromLanguage(translation.id, 'german')}
                              disabled={!translation.german?.trim() || translatingIds.has(translation.id)}
                              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                              title="Translate from German to all languages"
                            >
                              {translatingIds.has(translation.id) ? (
                                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleTTS(translation.id, 'german', translation.german || '')}
                              disabled={!translation.german?.trim() || ttsPlayingIds.has(`${translation.id}-german`)}
                              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                              title="Play German audio"
                            >
                            {ttsPlayingIds.has(`${translation.id}-german`) ? (
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776l-4.146-3.117H2a1 1 0 01-1-1V7.24a1 1 0 011-1h2.237l4.146-3.116a1 1 0 011.617.776zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd"/>
                              </svg>
                            )}
                          </button>
                          </div>
                        </div>
                        {getProposals(translation.german_proposals || '[]').length > 0 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            <strong>Suggestions:</strong>
                            <div className="grid grid-cols-2 gap-2">
                              <ul className="list-disc list-inside">
                                {getProposals(translation.german_proposals || '[]').slice(0, 5).map((proposal, idx) => (
                                  <li 
                                    key={idx} 
                                    className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                    onClick={() => handleTranslationChange(translation.id, 'german', proposal)}
                                  >
                                    {proposal}
                                  </li>
                                ))}
                              </ul>
                              {getProposals(translation.german_proposals || '[]').length > 5 && (
                                <ul className="list-disc list-inside">
                                  {getProposals(translation.german_proposals || '[]').slice(5, 10).map((proposal, idx) => (
                                    <li 
                                      key={idx + 5} 
                                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                      onClick={() => handleTranslationChange(translation.id, 'german', proposal)}
                                    >
                                      {proposal}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <textarea
                            value={translation.french}
                            onChange={(e) => handleTranslationChange(translation.id, 'french', e.target.value)}
                            className="flex-1 min-w-[130px] p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                            rows={2}
                            placeholder="French translation"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleTranslateFromLanguage(translation.id, 'french')}
                              disabled={!translation.french?.trim() || translatingIds.has(translation.id)}
                              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                              title="Translate from French to all languages"
                            >
                              {translatingIds.has(translation.id) ? (
                                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleTTS(translation.id, 'french', translation.french)}
                              disabled={!translation.french.trim() || ttsPlayingIds.has(`${translation.id}-french`)}
                              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                              title="Play French audio"
                            >
                            {ttsPlayingIds.has(`${translation.id}-french`) ? (
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776l-4.146-3.117H2a1 1 0 01-1-1V7.24a1 1 0 011-1h2.237l4.146-3.116a1 1 0 011.617.776zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd"/>
                              </svg>
                            )}
                          </button>
                          </div>
                        </div>
                        {getProposals(translation.french_proposals).length > 0 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            <strong>Suggestions:</strong>
                            <div className="grid grid-cols-2 gap-2">
                              <ul className="list-disc list-inside">
                                {getProposals(translation.french_proposals).slice(0, 5).map((proposal, idx) => (
                                  <li 
                                    key={idx} 
                                    className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                    onClick={() => handleTranslationChange(translation.id, 'french', proposal)}
                                  >
                                    {proposal}
                                  </li>
                                ))}
                              </ul>
                              {getProposals(translation.french_proposals).length > 5 && (
                                <ul className="list-disc list-inside">
                                  {getProposals(translation.french_proposals).slice(5, 10).map((proposal, idx) => (
                                    <li 
                                      key={idx + 5} 
                                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                      onClick={() => handleTranslationChange(translation.id, 'french', proposal)}
                                    >
                                      {proposal}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <textarea
                            value={translation.italian}
                            onChange={(e) => handleTranslationChange(translation.id, 'italian', e.target.value)}
                            className="flex-1 min-w-[130px] p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                            rows={2}
                            placeholder="Italian translation"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleTranslateFromLanguage(translation.id, 'italian')}
                              disabled={!translation.italian?.trim() || translatingIds.has(translation.id)}
                              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                              title="Translate from Italian to all languages"
                            >
                              {translatingIds.has(translation.id) ? (
                                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleTTS(translation.id, 'italian', translation.italian)}
                              disabled={!translation.italian.trim() || ttsPlayingIds.has(`${translation.id}-italian`)}
                              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                              title="Play Italian audio"
                            >
                            {ttsPlayingIds.has(`${translation.id}-italian`) ? (
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776l-4.146-3.117H2a1 1 0 01-1-1V7.24a1 1 0 011-1h2.237l4.146-3.116a1 1 0 011.617.776zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd"/>
                              </svg>
                            )}
                          </button>
                          </div>
                        </div>
                        {getProposals(translation.italian_proposals).length > 0 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            <strong>Suggestions:</strong>
                            <div className="grid grid-cols-2 gap-2">
                              <ul className="list-disc list-inside">
                                {getProposals(translation.italian_proposals).slice(0, 5).map((proposal, idx) => (
                                  <li 
                                    key={idx} 
                                    className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                    onClick={() => handleTranslationChange(translation.id, 'italian', proposal)}
                                  >
                                    {proposal}
                                  </li>
                                ))}
                              </ul>
                              {getProposals(translation.italian_proposals).length > 5 && (
                                <ul className="list-disc list-inside">
                                  {getProposals(translation.italian_proposals).slice(5, 10).map((proposal, idx) => (
                                    <li 
                                      key={idx + 5} 
                                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                      onClick={() => handleTranslationChange(translation.id, 'italian', proposal)}
                                    >
                                      {proposal}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <textarea
                            value={translation.spanish}
                            onChange={(e) => handleTranslationChange(translation.id, 'spanish', e.target.value)}
                            className="flex-1 min-w-[130px] p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                            rows={2}
                            placeholder="Spanish translation"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleTranslateFromLanguage(translation.id, 'spanish')}
                              disabled={!translation.spanish?.trim() || translatingIds.has(translation.id)}
                              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                              title="Translate from Spanish to all languages"
                            >
                              {translatingIds.has(translation.id) ? (
                                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleTTS(translation.id, 'spanish', translation.spanish)}
                              disabled={!translation.spanish.trim() || ttsPlayingIds.has(`${translation.id}-spanish`)}
                              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                              title="Play Spanish audio"
                            >
                            {ttsPlayingIds.has(`${translation.id}-spanish`) ? (
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776l-4.146-3.117H2a1 1 0 01-1-1V7.24a1 1 0 011-1h2.237l4.146-3.116a1 1 0 011.617.776zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd"/>
                              </svg>
                            )}
                          </button>
                          </div>
                        </div>
                        {getProposals(translation.spanish_proposals).length > 0 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            <strong>Suggestions:</strong>
                            <div className="grid grid-cols-2 gap-2">
                              <ul className="list-disc list-inside">
                                {getProposals(translation.spanish_proposals).slice(0, 5).map((proposal, idx) => (
                                  <li 
                                    key={idx} 
                                    className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                    onClick={() => handleTranslationChange(translation.id, 'spanish', proposal)}
                                  >
                                    {proposal}
                                  </li>
                                ))}
                              </ul>
                              {getProposals(translation.spanish_proposals).length > 5 && (
                                <ul className="list-disc list-inside">
                                  {getProposals(translation.spanish_proposals).slice(5, 10).map((proposal, idx) => (
                                    <li 
                                      key={idx + 5} 
                                      className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                      onClick={() => handleTranslationChange(translation.id, 'spanish', proposal)}
                                    >
                                      {proposal}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 align-top">
                      <div className="flex justify-center items-start pt-2">
                        <button
                          onClick={() => deleteRow(translation.id)}
                          className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                          title="Delete translation"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {translations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No translations yet. Add your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
