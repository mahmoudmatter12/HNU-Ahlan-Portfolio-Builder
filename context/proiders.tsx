import React, { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';

// Import your providers here
// import { AuthProvider } from './AuthProvider';
// import { ThemeProvider } from './ThemeProvider';
// import { SomeOtherProvider } from './SomeOtherProvider';

interface GlobalProvidersProps {
    children: ReactNode;
}

export const GlobalProviders: React.FC<GlobalProvidersProps> = ({ children }) => {
    return (
        <>
            <ThemeProvider attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </>
    );
};