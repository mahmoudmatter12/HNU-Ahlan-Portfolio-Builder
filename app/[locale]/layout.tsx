import type { Metadata } from "next";
import "./globals.css";
import { GlobalProviders } from "@/context/proiders";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import notFound from "../not-found";
import { routing } from "@/i18n/routing";
import BackgroundDecorations from "@/components/BackgroundDecorations";

export const metadata: Metadata = {
  title: "Ahlan Helwan National University",
  description: "Official Website of Helwan National University for Orientation days",
  icons: {
    icon: "/uni.png",
  }
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <BackgroundDecorations>
      <NextIntlClientProvider locale={locale}>
        <GlobalProviders>
          <div className="min-h-screen">
            {children}
          </div>
        </GlobalProviders>
      </NextIntlClientProvider>
    </BackgroundDecorations>
  );
}
