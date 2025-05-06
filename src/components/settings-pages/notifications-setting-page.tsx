// src/components/settings-pages/NotificationsSettings.tsx
'use client';

import { useContext } from 'react';
import { Switch } from '@headlessui/react';
import { SettingsContext } from '@/contexts/setting-context';

export default function NotificationsSettings() {
  const { settings, setSetting } = useContext(SettingsContext);

  return (
    <div className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-lg space-y-6">
      <h2 className="text-gray-200 text-lg font-semibold">Notifications</h2>

      {/* Price Alerts */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-200 font-semibold">Price Alerts</span>
          <Switch
            checked={settings.priceAlerts}
            onChange={(v) => setSetting('priceAlerts', v)}
            className={`${
              settings.priceAlerts ? 'bg-purple-600' : 'bg-gray-700'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span className="sr-only">Toggle price alerts</span>
            <span
              className={`${
                settings.priceAlerts ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
            />
          </Switch>
        </div>
        <p className="text-sm text-gray-400">
          Receive notifications about significant price changes
        </p>
      </div>

      {/* Transaction Alerts */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-200 font-semibold">Transaction Alerts</span>
          <Switch
            checked={settings.transactionAlerts}
            onChange={(v) => setSetting('transactionAlerts', v)}
            className={`${
              settings.transactionAlerts ? 'bg-purple-600' : 'bg-gray-700'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span className="sr-only">Toggle transaction alerts</span>
            <span
              className={`${
                settings.transactionAlerts ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
            />
          </Switch>
        </div>
        <p className="text-sm text-gray-400">
          Receive notifications when your transactions complete
        </p>
      </div>

      {/* Security Alerts */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-200 font-semibold">Security Alerts</span>
          <Switch
            checked={settings.securityAlerts}
            onChange={(v) => setSetting('securityAlerts', v)}
            className={`${
              settings.securityAlerts ? 'bg-purple-600' : 'bg-gray-700'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span className="sr-only">Toggle security alerts</span>
            <span
              className={`${
                settings.securityAlerts ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
            />
          </Switch>
        </div>
        <p className="text-sm text-gray-400">
          Receive notifications about suspicious activities
        </p>
      </div>
    </div>
  );
}
