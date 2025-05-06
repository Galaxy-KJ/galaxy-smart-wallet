// src/components/settings-pages/actions-panel.tsx
'use client';

import { useContext } from 'react';
import { RefreshCw } from 'lucide-react';
import { SettingsContext } from '@/contexts/setting-context';

export default function ActionsPanel() {
  const { settings } = useContext(SettingsContext);

  return (
    <div className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-lg shadow-lg space-y-6">
      <h2 className="text-gray-200 text-lg font-semibold">Actions</h2>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        className="w-full flex items-center justify-start space-x-2 bg-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg py-2 px-4 text-gray-200 transition-colors hover:bg-gray-800/50"
      >
        <RefreshCw className="h-5 w-5" />
        <span>Reset settings</span>
      </button>

      <div className="text-gray-200">
        <h3 className="font-semibold mb-2">Current settings</h3>
        <ul className="text-sm space-y-1">
          <li className="flex justify-between">
            <span>Theme</span>
            <span className="font-semibold">{settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}</span>
          </li>
          <li className="flex justify-between">
            <span>Accent color</span>
            <span className="font-semibold">{settings.accentColor.charAt(0).toUpperCase() + settings.accentColor.slice(1)}</span>
          </li>
          <li className="flex justify-between">
            <span>Chart style</span>
            <span className="font-semibold">{settings.chartStyle}</span>
          </li>
          <li className="flex justify-between">
            <span>Language</span>
            <span className="font-semibold">{settings.language.toUpperCase()}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
