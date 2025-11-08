'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { useState, useEffect } from 'react';

const PRESET_URLS = [
  { label: 'Environment Default', value: 'ENV_DEFAULT' },
  { label: 'Localhost:5432', value: 'http://localhost:5432' },
  { label: 'LibreTranslate.com', value: 'https://libretranslate.com' },
  { label: 'Gertrun Synology', value: 'https://libretranslate.gertrun.synology.me/' },
  { label: 'Custom URL', value: 'CUSTOM' }
];

export function SettingsContent() {
  const [apiUrl, setApiUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('ENV_DEFAULT');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      const url = data.libretranslate_url || '';
      setApiUrl(url);
      
      const preset = PRESET_URLS.find(p => p.value === url);
      if (preset) {
        setSelectedPreset(preset.value);
      } else {
        setSelectedPreset('CUSTOM');
        setCustomUrl(url);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    if (value === 'CUSTOM') {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      if (value === 'ENV_DEFAULT') {
        saveSettings(value);
      } else {
        saveSettings(value);
      }
    }
  };

  const saveSettings = async (url: string) => {
    setIsSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ libretranslate_url: url })
      });
      setApiUrl(url);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCustomUrlSave = () => {
    if (customUrl.trim()) {
      saveSettings(customUrl.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg transition-colors duration-200">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                title="Back to main page"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Theme</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Network</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      LibreTranslate API
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Base URL of the translation REST API
                    </p>
                    <select
                      value={selectedPreset}
                      onChange={(e) => handlePresetChange(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                      disabled={isSaving}
                    >
                      {PRESET_URLS.map((preset) => (
                        <option key={preset.value} value={preset.value}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                    {selectedPreset === 'CUSTOM' && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                          placeholder="Enter custom URL (e.g., https://api.example.com)"
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                          disabled={isSaving}
                        />
                        <button
                          onClick={handleCustomUrlSave}
                          disabled={!customUrl.trim() || isSaving}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    )}
                    {apiUrl && selectedPreset !== 'CUSTOM' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Current: {apiUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">About</h2>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Application:</span> Multi-Lingua Translation
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Version:</span> 1.0.0
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Description:</span> A translation app with LibreTranslate integration
                  </p>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
