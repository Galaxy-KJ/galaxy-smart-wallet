// src/components/settings-pages/LanguageSettings.tsx
'use client';

import { useContext } from 'react';
import { ChevronDown } from 'lucide-react';
import { SettingsContext } from '@/contexts/setting-context';

export default function LanguageSettings() {
  const { settings, setSetting } = useContext(SettingsContext);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSetting('language', e.target.value);
  };

  return (
    <div className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-lg space-y-4">
      {/* Application Language */}
      <div className="space-y-1">
        <label className="block text-gray-200 font-semibold">Application Language</label>
        <p className="text-sm text-gray-400">Select the language for the user interface</p>
        <div className="relative">
          <select
            value={settings.language}
            onChange={handleChange}
            className="w-full bg-gray-800 text-gray-200 px-3 py-2 pr-10 rounded-lg appearance-none"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            {/* Add more languages as needed */}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Note */}
      <p className="text-xs text-gray-500">
        Language changes will apply throughout the application. Some sections may remain in the original language until the next update.
      </p>
    </div>
  );
}
