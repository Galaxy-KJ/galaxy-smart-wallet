// src/components/settings-pages/Tabs.tsx
'use client';

import React from 'react';
import {
  PaletteIcon,
  ChartBarIcon,
  BellIcon,
  GlobeIcon
} from 'lucide-react';

// Reemplazamos SwatchIcon por PaletteIcon para el ícono de tema

type TabKey = 'theme' | 'visualization' | 'notifications' | 'language';

interface TabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabList: {
  key: TabKey;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}[] = [
  { key: 'theme',         label: 'Theme',         Icon: PaletteIcon     },
  { key: 'visualization', label: 'Visualization', Icon: ChartBarIcon    },
  { key: 'notifications', label: 'Notifications', Icon: BellIcon        },
  { key: 'language',      label: 'Language',      Icon: GlobeIcon    },
];

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <nav className="flex bg-gray-800/30 backdrop-blur-sm rounded-lg overflow-hidden">
      {tabList.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={
            `flex-1 flex items-center justify-center px-4 py-2 transition-colors ` +
            (active === key
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:bg-gray-700/50')
          }
        >
          <Icon className="h-5 w-5 mr-2" />
          {label}
        </button>
      ))}
    </nav>
  );
}
