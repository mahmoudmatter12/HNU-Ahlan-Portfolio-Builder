import React, { createContext, useContext, useMemo } from 'react';
import { College } from '@/types/Collage';

interface CollageThemeContextValue {
  college: College;
  theme: Record<string, any> | null;
}

const CollageThemeContext = createContext<CollageThemeContextValue | undefined>(undefined);

interface CollageThemeProviderProps {
  college: College;
  children: React.ReactNode;
}

export const CollageThemeProvider: React.FC<CollageThemeProviderProps> = ({ college, children }) => {
  const value = useMemo(() => ({
    college,
    theme: college.theme ?? null,
  }), [college]);

  return (
    <CollageThemeContext.Provider value={value}>
      {children}
    </CollageThemeContext.Provider>
  );
};

export function useCollageTheme() {
  const context = useContext(CollageThemeContext);
  if (!context) {
    throw new Error('useCollageTheme must be used within a CollageThemeProvider');
  }
  return context;
} 