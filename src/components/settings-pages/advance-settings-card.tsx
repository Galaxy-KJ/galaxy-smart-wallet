'use client';

export default function AdvancedSettingsCard() {
  return (
    <div className="p-6 bg-purple-800/80 backdrop-blur-sm border border-purple-900 rounded-lg shadow-lg space-y-4 text-white">
      <h3 className="text-lg font-semibold">Need more options?</h3>
      <p className="text-gray-200">Explore advanced settings to further customize your Galaxy Wallet experience.</p>
      <button className="bg-white text-purple-800 px-4 py-2 rounded-lg transition-colors hover:bg-gray-100">
        Advanced Settings
      </button>
    </div>
  );
}