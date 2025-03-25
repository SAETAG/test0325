import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings } from '../types/settings';
import { getAppSettings } from '../lib/firebase';

interface SettingsContextType {
    settings: AppSettings | null;
    isLoading: boolean;
    error: Error | null;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: null,
    isLoading: true,
    error: null,
});

export function useSettings() {
    return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function loadSettings() {
            try {
                setIsLoading(true);
                const appSettings = await getAppSettings();
                setSettings(appSettings);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load settings'));
                console.error('Error loading settings:', err);
            } finally {
                setIsLoading(false);
            }
        }

        loadSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, isLoading, error }}>
            {children}
        </SettingsContext.Provider>
    );
}
