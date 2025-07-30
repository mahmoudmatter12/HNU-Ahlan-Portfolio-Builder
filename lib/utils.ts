import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getThemeStyle(
  theme: Record<string, any> | null
): React.CSSProperties {
  return {
    "--heading-color": theme?.colors?.heading || "#133d85",
    "--subheading-color": theme?.colors?.subHeading || "#ce7940",
    "--text-color": theme?.colors?.text || "#333333",
    "--primary-color": theme?.colors?.primary || "#3b82f6",
    "--secondary-color": theme?.colors?.secondary || "#64748b",
    "--accent-color": theme?.colors?.accent || "#f59e0b",
    "--background-color": theme?.colors?.background || "#ffffff",
    "--surface-color": theme?.colors?.surface || "#f8fafc",
    "--border-color": theme?.colors?.border || "#e2e8f0",
    "--heading-font": theme?.fonts?.heading || "Poppins, sans-serif",
    "--body-font": theme?.fonts?.body || "Roboto, sans-serif",
    "--border-radius": theme?.effects?.borderRadius || "0.5rem",
    "--shadow": theme?.effects?.shadow || "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    "--transition": theme?.effects?.transition || "all 0.2s ease-in-out",
  } as React.CSSProperties;
}
