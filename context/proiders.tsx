"use client"
import React, { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryClientProviderWrapper } from './QueryClientProvider';
import { UserProvider } from './userContext';
import { UniversityProvider } from './universityContext';
import { Toaster } from '@/components/ui/sonner';

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
            <ClerkProvider>
                <ThemeProvider attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryClientProviderWrapper>
                        <UserProvider>
                            <UniversityProvider>
                                {children}
                                <Toaster />
                            </UniversityProvider>
                        </UserProvider>
                    </QueryClientProviderWrapper>
                </ThemeProvider>
            </ClerkProvider>
        </>
    );
};