'use client';

import { useState, useEffect } from 'react';

const PROVIDERS = [
  { id: 'libretranslate', label: 'LT', name: 'LibreTranslate' },
  { id: 'mymemory', label: 'MM', name: 'MyMemory' },
  { id: 'google', label: 'GO', name: 'Google' },
  { id: 'deepl', label: 'DL', name: 'DeepL' },
  { id: 'azure', label: 'AZ', name: 'Azure' },
  { id: 'pons', label: 'PN', name: 'PONS' },
  { id: 'merriam-webster', label: 'MW', name: 'Merriam-Webster' },
  { id: 'free-dictionary', label: 'FD', name: 'Free Dictionary' },
  { id: 'oxford', label: 'OX', name: 'Oxford' },
];

export function ProviderSelector() {
  const [activeProvider, setActiveProvider] = useState<string>('');
  const [allProviders, setAllProviders] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/providers');
      const data = await response.json();
      setAllProviders(data.providers || []);
      
      // Find the enabled provider
      const enabledProvider = data.providers?.find((p: any) => p.enabled === 1 || p.enabled === true);
      if (enabledProvider) {
        setActiveProvider(enabledProvider.type);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleProviderChange = async (providerId: string) => {
    if (isUpdating || providerId === activeProvider) return;
    
    console.log(`[ProviderSelector] Toggling to provider: ${providerId}`);
    setIsUpdating(true);
    setActiveProvider(providerId);
    
    try {
      // Disable all providers first (SEQUENTIALLY like SettingsContent)
      for (const p of PROVIDERS) {
        if (p.id !== providerId) {
          const provider = allProviders.find(ap => ap.type === p.id) || {};
          console.log(`[ProviderSelector] Disabling provider: ${p.id}`);
          await saveProvider(p.id, { ...provider, enabled: false });
        }
      }
      
      // Enable the selected provider
      const provider = allProviders.find(p => p.type === providerId) || {};
      console.log(`[ProviderSelector] Enabling provider: ${providerId}`, provider);
      await saveProvider(providerId, { ...provider, enabled: true });
      
      // Refresh providers from database to sync UI
      console.log(`[ProviderSelector] Refreshing providers from DB`);
      await fetchProviders();
      
      console.log(`[ProviderSelector] Provider ${providerId} is now active`);
    } catch (error) {
      console.error('[ProviderSelector] Error updating provider:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const saveProvider = async (type: string, config: any) => {
    // Map frontend config keys to backend API keys (same as SettingsContent)
    const payload = {
      type,
      enabled: config.enabled,
      apiKey: config.api_key,
      apiUrl: config.api_url,
      region: config.region,
      email: config.email,
      appId: config.app_id
    };
    
    const response = await fetch('/api/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save provider: ${response.statusText}`);
    }
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {PROVIDERS.map((provider) => {
        const isActive = activeProvider === provider.id;
        
        return (
          <button
            key={provider.id}
            onClick={() => handleProviderChange(provider.id)}
            title={provider.name}
            className={`
              relative inline-flex items-center justify-center p-2 rounded-lg border font-bold text-xs
              transition-all duration-200
              ${isActive
                ? 'bg-blue-600 text-white dark:bg-blue-500 border-blue-600 dark:border-blue-500 shadow-md'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
          >
            <span className="w-5 h-5 inline-flex items-center justify-center">{provider.label}</span>
            {isActive && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            )}
          </button>
        );
      })}
    </div>
  );
}
