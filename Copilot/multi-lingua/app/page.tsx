'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';

interface Translation {
  id: number;
  english: string;
  french: string;
  italian: string;
  spanish: string;
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
  const [translatingIds, setTranslatingIds] = useState<Set<number>>(new Set());
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      const response = await fetch('/api/translations');
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Error fetching translations:', error);
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

  const translateText = async (text: string) => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Translation error:', error);
      return null;
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

  const handleTranslateRow = async (id: number) => {
    const translation = translations.find(t => t.id === id);
    if (!translation || !translation.english.trim()) {
      return;
    }

    // Set loading state
    setTranslatingIds(prev => new Set(prev).add(id));

    try {
      const translationResult = await translateText(translation.english);
      if (translationResult) {
        const updatedTranslation = {
          french: translationResult.french.translation,
          italian: translationResult.italian.translation,
          spanish: translationResult.spanish.translation,
          french_proposals: JSON.stringify(translationResult.french.alternatives),
          italian_proposals: JSON.stringify(translationResult.italian.alternatives),
          spanish_proposals: JSON.stringify(translationResult.spanish.alternatives),
        };

        // Update the database
        await fetch('/api/translations', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, ...updatedTranslation }),
        });

        // Update local state with translations
        setTranslations(prev => prev.map(t => 
          t.id === id ? { ...t, ...updatedTranslation } : t
        ));
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      // Remove loading state
      setTranslatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
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

  const addNewRow = async () => {
    try {
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          english: '',
          french: '',
          italian: '',
          spanish: '',
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
        <div className="text-xl text-gray-900 dark:text-gray-100">Loading...</div>
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
                <col style={{ minWidth: '140px', width: '25%' }} />
                <col style={{ minWidth: '140px', width: '25%' }} />
                <col style={{ minWidth: '140px', width: '25%' }} />
                <col style={{ minWidth: '140px', width: '25%' }} />
                <col style={{ minWidth: '120px', width: '120px' }} />
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
                    French
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Italian
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Spanish
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {translations.map((translation) => (
                  <tr key={translation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-4 py-3 align-top">
                      <textarea
                        value={translation.english}
                        onChange={(e) => handleEnglishChange(translation.id, e.target.value)}
                        className="w-full min-w-[130px] p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                        rows={2}
                        placeholder="Enter English text"
                      />
                    </td>
                    
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-2">
                        <textarea
                          value={translation.french}
                          onChange={(e) => handleTranslationChange(translation.id, 'french', e.target.value)}
                          className="w-full min-w-[130px] p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                          rows={2}
                          placeholder="French translation"
                        />
                        {getProposals(translation.french_proposals).length > 0 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <strong>Suggestions:</strong>
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
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-2">
                        <textarea
                          value={translation.italian}
                          onChange={(e) => handleTranslationChange(translation.id, 'italian', e.target.value)}
                          className="w-full min-w-[130px] p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                          rows={2}
                          placeholder="Italian translation"
                        />
                        {getProposals(translation.italian_proposals).length > 0 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <strong>Suggestions:</strong>
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
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-2">
                        <textarea
                          value={translation.spanish}
                          onChange={(e) => handleTranslationChange(translation.id, 'spanish', e.target.value)}
                          className="w-full min-w-[130px] p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                          rows={2}
                          placeholder="Spanish translation"
                        />
                        {getProposals(translation.spanish_proposals).length > 0 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <strong>Suggestions:</strong>
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
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-1.5 mb-4">
                        <button
                          onClick={() => handleTranslateRow(translation.id)}
                          disabled={!translation.english.trim() || translatingIds.has(translation.id)}
                          className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-1 px-3 rounded text-sm transition-colors duration-200 w-full min-w-[90px] whitespace-nowrap"
                        >
                          {translatingIds.has(translation.id) ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            </div>
                          ) : (
                            'Translate'
                          )}
                        </button>
                        <button
                          onClick={() => deleteRow(translation.id)}
                          className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors duration-200 w-full min-w-[90px] whitespace-nowrap"
                        >
                          Delete
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
