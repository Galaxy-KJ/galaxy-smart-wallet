// src/components/settings-pages/VisualizationSettings.tsx
'use client';

import { useContext } from 'react';
import { Switch } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { SettingsContext } from '@/contexts/setting-context';

export default function VisualizationSettings() {
  const { settings, setSetting } = useContext(SettingsContext);

  const handleChartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSetting('chartStyle', e.target.value);
  };

  return (
    <div className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-lg space-y-6">
      {/* Chart Style Section */}
      <div className="space-y-1">
        <label className="block text-gray-200 font-semibold">Chart Style</label>
        <p className="text-sm text-gray-400">Customize the appearance of charts</p>
        <div className="relative">
          <select
            value={settings.chartStyle}
            onChange={handleChartChange}
            className="w-full bg-gray-800 text-gray-200 px-3 py-2 pr-10 rounded-lg appearance-none"
          >
            <option>Gradient</option>
            <option>Solid</option>
            <option>Dashed</option>
            <option>Line</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2"
          />
        </div>
      </div>

      {/* Show Balances Section */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-200 font-semibold">Show Balances</span>
          <Switch
            checked={settings.showBalances}
            onChange={(v) => setSetting('showBalances', v)}
            className={`${
              settings.showBalances ? 'bg-purple-600' : 'bg-gray-700'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span className="sr-only">Toggle show balances</span>
            <span
              className={`${
                settings.showBalances ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
            />
          </Switch>
        </div>
        <p className="text-sm text-gray-400">Show or hide your asset balances</p>
      </div>

      {/* Compact Mode Section */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-200 font-semibold">Compact Mode</span>
          <Switch
            checked={settings.compactMode}
            onChange={(v) => setSetting('compactMode', v)}
            className={`${
              settings.compactMode ? 'bg-purple-600' : 'bg-gray-700'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span className="sr-only">Toggle compact mode</span>
            <span
              className={`${
                settings.compactMode ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
            />
          </Switch>
        </div>
        <p className="text-sm text-gray-400">Reduce spacing between elements to see more content</p>
      </div>
    </div>
  );
}
