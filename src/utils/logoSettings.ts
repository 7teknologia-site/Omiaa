import { useState, useEffect } from 'react';

export interface SiteLogoSettings {
  logoUrl: string;
  heightSm: number; // Height in px for mobile layout (20 - 120px)
  heightMd: number; // Height in px for desktop layout (24 - 160px)
  blendMode: 'normal' | 'multiply' | 'color-burn' | 'screen' | 'darken';
  opacity: number; // 10 - 100 (%)
  contrast: number; // 50 - 150 (%)
  brightness: number; // 50 - 150 (%)
  invertInDarkTheme: boolean; // Automatically adjust logo color filter on dark backgrounds
}

export const DEFAULT_LOGO_SETTINGS: SiteLogoSettings = {
  logoUrl: '/logo.svg',
  heightSm: 40,
  heightMd: 54,
  blendMode: 'multiply',
  opacity: 100,
  contrast: 100,
  brightness: 100,
  invertInDarkTheme: false,
};

export const LOGO_STORAGE_KEY = 'omiaa_custom_logo_settings_v1';

export function getSavedLogoSettings(): SiteLogoSettings {
  try {
    const savedStore = localStorage.getItem('omiaa_store_settings_v2');
    if (savedStore) {
      const parsedStore = JSON.parse(savedStore);
      if (parsedStore?.visualIdentity) {
        const vi = parsedStore.visualIdentity;
        return {
          logoUrl: vi.logoMainUrl || '/logo.svg',
          heightSm: vi.heightSm || 48,
          heightMd: vi.heightMd || 64,
          blendMode: vi.blendMode || 'multiply',
          opacity: 100,
          contrast: vi.contrast || 100,
          brightness: vi.brightness || 100,
          invertInDarkTheme: false
        };
      }
    }

    const saved = localStorage.getItem(LOGO_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_LOGO_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load logo settings from localStorage:', e);
  }
  return DEFAULT_LOGO_SETTINGS;
}

export function saveLogoSettings(settings: SiteLogoSettings): void {
  try {
    localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('omiaa_logo_changed'));
  } catch (e) {
    console.error('Failed to save logo settings to localStorage:', e);
  }
}

export function useLogoSettings() {
  const [logoSettings, setLogoSettings] = useState<SiteLogoSettings>(getSavedLogoSettings);

  useEffect(() => {
    const handleLogoChange = () => {
      setLogoSettings(getSavedLogoSettings());
    };

    window.addEventListener('omiaa_logo_changed', handleLogoChange);
    window.addEventListener('storage', handleLogoChange);

    return () => {
      window.removeEventListener('omiaa_logo_changed', handleLogoChange);
      window.removeEventListener('storage', handleLogoChange);
    };
  }, []);

  return logoSettings;
}
