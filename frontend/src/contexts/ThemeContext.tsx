import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorTheme = 'pink' | 'purple' | 'blue' | 'green' | 'orange' | 'red';
export type AppearanceMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colorTheme: ColorTheme;
  appearanceMode: AppearanceMode;
  setColorTheme: (theme: ColorTheme) => void;
  setAppearanceMode: (mode: AppearanceMode) => void;
  isDark: boolean;
}

const colorThemes: Record<ColorTheme, { light: Record<string, string>; dark: Record<string, string> }> = {
  pink: {
    light: {
      '--primary': '333 71% 50%',
      '--primary-foreground': '327 73% 97%',
      '--accent': '355 100% 97%',
      '--accent-foreground': '349 89% 60%',
      '--ring': '333 71% 50%',
    },
    dark: {
      '--primary': '328 85% 70%',
      '--primary-foreground': '336 83% 17%',
      '--accent': '343 87% 15%',
      '--accent-foreground': '351 94% 71%',
      '--ring': '328 85% 70%',
    },
  },
  purple: {
    light: {
      '--primary': '271 76% 53%',
      '--primary-foreground': '270 100% 98%',
      '--accent': '270 100% 97%',
      '--accent-foreground': '271 76% 53%',
      '--ring': '271 76% 53%',
    },
    dark: {
      '--primary': '271 91% 65%',
      '--primary-foreground': '271 100% 10%',
      '--accent': '271 50% 15%',
      '--accent-foreground': '271 91% 65%',
      '--ring': '271 91% 65%',
    },
  },
  blue: {
    light: {
      '--primary': '217 91% 60%',
      '--primary-foreground': '217 100% 98%',
      '--accent': '217 100% 97%',
      '--accent-foreground': '217 91% 60%',
      '--ring': '217 91% 60%',
    },
    dark: {
      '--primary': '217 91% 65%',
      '--primary-foreground': '217 100% 10%',
      '--accent': '217 50% 15%',
      '--accent-foreground': '217 91% 65%',
      '--ring': '217 91% 65%',
    },
  },
  green: {
    light: {
      '--primary': '142 76% 36%',
      '--primary-foreground': '142 100% 98%',
      '--accent': '142 100% 97%',
      '--accent-foreground': '142 76% 36%',
      '--ring': '142 76% 36%',
    },
    dark: {
      '--primary': '142 69% 58%',
      '--primary-foreground': '142 100% 10%',
      '--accent': '142 50% 15%',
      '--accent-foreground': '142 69% 58%',
      '--ring': '142 69% 58%',
    },
  },
  orange: {
    light: {
      '--primary': '24 95% 53%',
      '--primary-foreground': '24 100% 98%',
      '--accent': '24 100% 97%',
      '--accent-foreground': '24 95% 53%',
      '--ring': '24 95% 53%',
    },
    dark: {
      '--primary': '24 95% 64%',
      '--primary-foreground': '24 100% 10%',
      '--accent': '24 50% 15%',
      '--accent-foreground': '24 95% 64%',
      '--ring': '24 95% 64%',
    },
  },
  red: {
    light: {
      '--primary': '0 84% 60%',
      '--primary-foreground': '0 100% 98%',
      '--accent': '0 100% 97%',
      '--accent-foreground': '0 84% 60%',
      '--ring': '0 84% 60%',
    },
    dark: {
      '--primary': '0 84% 65%',
      '--primary-foreground': '0 100% 10%',
      '--accent': '0 50% 15%',
      '--accent-foreground': '0 84% 65%',
      '--ring': '0 84% 65%',
    },
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem('loveos-color-theme');
    return (saved as ColorTheme) || 'pink';
  });

  const [appearanceMode, setAppearanceModeState] = useState<AppearanceMode>(() => {
    const saved = localStorage.getItem('loveos-appearance-mode');
    return (saved as AppearanceMode) || 'light';
  });

  const [isDark, setIsDark] = useState(false);

  // Handle system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (appearanceMode === 'system') {
        setIsDark(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [appearanceMode]);

  // Update isDark based on appearance mode
  useEffect(() => {
    if (appearanceMode === 'system') {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
      setIsDark(appearanceMode === 'dark');
    }
  }, [appearanceMode]);

  // Apply theme colors to document
  useEffect(() => {
    const root = document.documentElement;
    const mode = isDark ? 'dark' : 'light';
    const themeColors = colorThemes[colorTheme][mode];

    // Apply color variables
    Object.entries(themeColors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Apply dark class
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [colorTheme, isDark]);

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem('loveos-color-theme', theme);
  };

  const setAppearanceMode = (mode: AppearanceMode) => {
    setAppearanceModeState(mode);
    localStorage.setItem('loveos-appearance-mode', mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        colorTheme,
        appearanceMode,
        setColorTheme,
        setAppearanceMode,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
