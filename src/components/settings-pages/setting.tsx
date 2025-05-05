// src/components/settings-pages/SettingsPage.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Tabs from './tabs';
import ThemeSettings from './theme-page';
import VisualizationSettings from './visualization-setting-page';
import NotificationsSettings from './notifications-setting-page';
import LanguageSettings from './language-setting-page';
import ActionsPanel from './actions-panel';
import AdvancedSettingsCard from './advance-settings-card';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'theme'|'visualization'|'notifications'|'language'>('theme');
    const router = useRouter();
  
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-3">
          <button
            onClick={() => router.back()}
            className="text-gray-300 hover:text-gray-100 transition"
            aria-label="Go back"
          >
            {/* proper chevron icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Settings & Preferences
            </h1>
            <p className="text-sm text-gray-400 mt-1">Customize your Galaxy Wallet experience</p>
          </div>
        </div>
  
        {/* Panels */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Customization Panel */}
          <div className="flex-1">
            <div className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-lg shadow-lg space-y-6">
              <h2 className="text-lg text-gray-200 font-semibold">Customization</h2>
              <Tabs active={activeTab} onChange={setActiveTab} />
              {activeTab === 'theme'         && <ThemeSettings />}
              {activeTab === 'visualization' && <VisualizationSettings />}
              {activeTab === 'notifications' && <NotificationsSettings />}
              {activeTab === 'language'      && <LanguageSettings />}
            </div>
          </div>
  
          {/* Right Column: Actions + Advanced */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <ActionsPanel />
            <AdvancedSettingsCard />
          </div>
        </div>
      </div>
    );
  }
  
  