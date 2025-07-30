import type { Metadata } from "next";
import "./[locale]/globals.css";

export const metadata: Metadata = {
    title: "Ahlan Helwan National University",
    description: "Official Website of Helwan National University for Orientation days",
    icons: {
        icon: "/uni.png",
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                {children}
            </body>
        </html>
    );
}
