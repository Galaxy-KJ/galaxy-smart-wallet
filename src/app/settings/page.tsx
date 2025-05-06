import SettingsPage from '@/components/settings-pages/setting';
import { SettingsProvider } from '@/contexts/setting-context';

export default function SettingsRoute() {
    return (
        <SettingsProvider>
        <SettingsPage />
        </SettingsProvider>
    );
}
