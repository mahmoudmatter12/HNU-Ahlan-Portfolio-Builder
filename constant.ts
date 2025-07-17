// Stored themes - predefined theme configurations
export interface StoredTheme {
    id: string
    name: string
    description: string
    preview: {
        primary: string
        secondary: string
        accent: string
        background: string
        surface: string
    }
    theme: {
        colors: {
            heading: string
            subHeading: string
            text: string
            primary: string
            secondary: string
            accent: string
            background: string
            surface: string
            border: string
        }
        fonts: {
            heading: string
            body: string
        }
        typography: {
            headingSize: string
            subHeadingSize: string
            bodySize: string
            smallSize: string
        }
        spacing: {
            sectionPadding: string
            elementSpacing: string
            containerMaxWidth: string
        }
        effects: {
            borderRadius: string
            shadow: string
            transition: string
        }
        mode: "light" | "dark" | "auto"
        enableAnimations: boolean
        enableGradients: boolean
        lightTheme: {
            colors: {
                heading: string
                subHeading: string
                text: string
                primary: string
                secondary: string
                accent: string
                background: string
                surface: string
                border: string
            }
        }
        darkTheme: {
            colors: {
                heading: string
                subHeading: string
                text: string
                primary: string
                secondary: string
                accent: string
                background: string
                surface: string
                border: string
            }
        }
    }
}

export const STORED_THEMES: StoredTheme[] = [
    {
        id: "modern-blue",
        name: "Modern Blue",
        description: "Clean and professional blue theme",
        preview: {
            primary: "#3b82f6",
            secondary: "#64748b",
            accent: "#0ea5e9",
            background: "#ffffff",
            surface: "#f8fafc",
        },
        theme: {
            colors: {
                heading: "#1e40af",
                subHeading: "#3b82f6",
                text: "#1f2937",
                primary: "#3b82f6",
                secondary: "#64748b",
                accent: "#0ea5e9",
                background: "#ffffff",
                surface: "#f8fafc",
                border: "#e2e8f0",
            },
            fonts: {
                heading: "Inter, sans-serif",
                body: "Inter, sans-serif",
            },
            typography: {
                headingSize: "3xl",
                subHeadingSize: "xl",
                bodySize: "base",
                smallSize: "sm",
            },
            spacing: {
                sectionPadding: "3rem",
                elementSpacing: "1.5rem",
                containerMaxWidth: "1200px",
            },
            effects: {
                borderRadius: "0.75rem",
                shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transition: "all 0.2s ease-in-out",
            },
            mode: "light" as const,
            enableAnimations: true,
            enableGradients: false,
            lightTheme: {
                colors: {
                    heading: "#1e40af",
                    subHeading: "#3b82f6",
                    text: "#1f2937",
                    primary: "#3b82f6",
                    secondary: "#64748b",
                    accent: "#0ea5e9",
                    background: "#ffffff",
                    surface: "#f8fafc",
                    border: "#e2e8f0",
                },
            },
            darkTheme: {
                colors: {
                    heading: "#dbeafe",
                    subHeading: "#93c5fd",
                    text: "#e2e8f0",
                    primary: "#3b82f6",
                    secondary: "#64748b",
                    accent: "#0ea5e9",
                    background: "#0f172a",
                    surface: "#1e293b",
                    border: "#334155",
                },
            },
        },
    },
    {
        id: "warm-orange",
        name: "Warm Orange",
        description: "Friendly and energetic orange theme",
        preview: {
            primary: "#f97316",
            secondary: "#f59e0b",
            accent: "#ea580c",
            background: "#fff7ed",
            surface: "#fed7aa",
        },
        theme: {
            colors: {
                heading: "#ea580c",
                subHeading: "#f97316",
                text: "#451a03",
                primary: "#f97316",
                secondary: "#f59e0b",
                accent: "#ea580c",
                background: "#fff7ed",
                surface: "#fed7aa",
                border: "#fdba74",
            },
            fonts: {
                heading: "Poppins, sans-serif",
                body: "Open Sans, sans-serif",
            },
            typography: {
                headingSize: "4xl",
                subHeadingSize: "2xl",
                bodySize: "lg",
                smallSize: "base",
            },
            spacing: {
                sectionPadding: "4rem",
                elementSpacing: "2rem",
                containerMaxWidth: "1400px",
            },
            effects: {
                borderRadius: "1rem",
                shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease-in-out",
            },
            mode: "light" as const,
            enableAnimations: true,
            enableGradients: true,
            lightTheme: {
                colors: {
                    heading: "#ea580c",
                    subHeading: "#f97316",
                    text: "#451a03",
                    primary: "#f97316",
                    secondary: "#f59e0b",
                    accent: "#ea580c",
                    background: "#fff7ed",
                    surface: "#fed7aa",
                    border: "#fdba74",
                },
            },
            darkTheme: {
                colors: {
                    heading: "#fed7aa",
                    subHeading: "#fdba74",
                    text: "#fef3c7",
                    primary: "#f97316",
                    secondary: "#f59e0b",
                    accent: "#ea580c",
                    background: "#1c1917",
                    surface: "#292524",
                    border: "#44403c",
                },
            },
        },
    },
    {
        id: "elegant-purple",
        name: "Elegant Purple",
        description: "Sophisticated purple theme",
        preview: {
            primary: "#8b5cf6",
            secondary: "#a855f7",
            accent: "#7c3aed",
            background: "#faf5ff",
            surface: "#ede9fe",
        },
        theme: {
            colors: {
                heading: "#581c87",
                subHeading: "#7c3aed",
                text: "#1e1b4b",
                primary: "#8b5cf6",
                secondary: "#a855f7",
                accent: "#7c3aed",
                background: "#faf5ff",
                surface: "#ede9fe",
                border: "#c4b5fd",
            },
            fonts: {
                heading: "Playfair Display, serif",
                body: "Merriweather, serif",
            },
            typography: {
                headingSize: "5xl",
                subHeadingSize: "3xl",
                bodySize: "lg",
                smallSize: "base",
            },
            spacing: {
                sectionPadding: "5rem",
                elementSpacing: "2.5rem",
                containerMaxWidth: "1200px",
            },
            effects: {
                borderRadius: "0.5rem",
                shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: "all 0.5s ease-in-out",
            },
            mode: "light" as const,
            enableAnimations: true,
            enableGradients: true,
            lightTheme: {
                colors: {
                    heading: "#581c87",
                    subHeading: "#7c3aed",
                    text: "#1e1b4b",
                    primary: "#8b5cf6",
                    secondary: "#a855f7",
                    accent: "#7c3aed",
                    background: "#faf5ff",
                    surface: "#ede9fe",
                    border: "#c4b5fd",
                },
            },
            darkTheme: {
                colors: {
                    heading: "#e9d5ff",
                    subHeading: "#c4b5fd",
                    text: "#ddd6fe",
                    primary: "#8b5cf6",
                    secondary: "#a855f7",
                    accent: "#7c3aed",
                    background: "#1e1b4b",
                    surface: "#312e81",
                    border: "#4c1d95",
                },
            },
        },
    },
    {
        id: "minimal-gray",
        name: "Minimal Gray",
        description: "Clean and minimal gray theme",
        preview: {
            primary: "#6b7280",
            secondary: "#9ca3af",
            accent: "#4b5563",
            background: "#ffffff",
            surface: "#f9fafb",
        },
        theme: {
            colors: {
                heading: "#111827",
                subHeading: "#374151",
                text: "#4b5563",
                primary: "#6b7280",
                secondary: "#9ca3af",
                accent: "#4b5563",
                background: "#ffffff",
                surface: "#f9fafb",
                border: "#e5e7eb",
            },
            fonts: {
                heading: "Inter, sans-serif",
                body: "Inter, sans-serif",
            },
            typography: {
                headingSize: "2xl",
                subHeadingSize: "lg",
                bodySize: "base",
                smallSize: "sm",
            },
            spacing: {
                sectionPadding: "2rem",
                elementSpacing: "1rem",
                containerMaxWidth: "1000px",
            },
            effects: {
                borderRadius: "0.25rem",
                shadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                transition: "all 0.15s ease-in-out",
            },
            mode: "light" as const,
            enableAnimations: false,
            enableGradients: false,
            lightTheme: {
                colors: {
                    heading: "#111827",
                    subHeading: "#374151",
                    text: "#4b5563",
                    primary: "#6b7280",
                    secondary: "#9ca3af",
                    accent: "#4b5563",
                    background: "#ffffff",
                    surface: "#f9fafb",
                    border: "#e5e7eb",
                },
            },
            darkTheme: {
                colors: {
                    heading: "#f9fafb",
                    subHeading: "#d1d5db",
                    text: "#9ca3af",
                    primary: "#6b7280",
                    secondary: "#9ca3af",
                    accent: "#4b5563",
                    background: "#111827",
                    surface: "#1f2937",
                    border: "#374151",
                },
            },
        },
    },
    {
        id: "nature-green",
        name: "Nature Green",
        description: "Fresh and natural green theme",
        preview: {
            primary: "#10b981",
            secondary: "#059669",
            accent: "#047857",
            background: "#f0fdf4",
            surface: "#dcfce7",
        },
        theme: {
            colors: {
                heading: "#065f46",
                subHeading: "#047857",
                text: "#064e3b",
                primary: "#10b981",
                secondary: "#059669",
                accent: "#047857",
                background: "#f0fdf4",
                surface: "#dcfce7",
                border: "#bbf7d0",
            },
            fonts: {
                heading: "Nunito, sans-serif",
                body: "Open Sans, sans-serif",
            },
            typography: {
                headingSize: "3xl",
                subHeadingSize: "xl",
                bodySize: "base",
                smallSize: "sm",
            },
            spacing: {
                sectionPadding: "3rem",
                elementSpacing: "1.5rem",
                containerMaxWidth: "1200px",
            },
            effects: {
                borderRadius: "0.75rem",
                shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transition: "all 0.2s ease-in-out",
            },
            mode: "light" as const,
            enableAnimations: true,
            enableGradients: false,
            lightTheme: {
                colors: {
                    heading: "#065f46",
                    subHeading: "#047857",
                    text: "#064e3b",
                    primary: "#10b981",
                    secondary: "#059669",
                    accent: "#047857",
                    background: "#f0fdf4",
                    surface: "#dcfce7",
                    border: "#bbf7d0",
                },
            },
            darkTheme: {
                colors: {
                    heading: "#bbf7d0",
                    subHeading: "#86efac",
                    text: "#d1fae5",
                    primary: "#10b981",
                    secondary: "#059669",
                    accent: "#047857",
                    background: "#064e3b",
                    surface: "#065f46",
                    border: "#047857",
                },
            },
        },
    },
    {
        id: "corporate-dark",
        name: "Corporate Dark",
        description: "Professional dark theme",
        preview: {
            primary: "#3b82f6",
            secondary: "#64748b",
            accent: "#0ea5e9",
            background: "#0f172a",
            surface: "#1e293b",
        },
        theme: {
            colors: {
                heading: "#f8fafc",
                subHeading: "#cbd5e1",
                text: "#94a3b8",
                primary: "#3b82f6",
                secondary: "#64748b",
                accent: "#0ea5e9",
                background: "#0f172a",
                surface: "#1e293b",
                border: "#334155",
            },
            fonts: {
                heading: "Inter, sans-serif",
                body: "Inter, sans-serif",
            },
            typography: {
                headingSize: "3xl",
                subHeadingSize: "xl",
                bodySize: "base",
                smallSize: "sm",
            },
            spacing: {
                sectionPadding: "3rem",
                elementSpacing: "1.5rem",
                containerMaxWidth: "1200px",
            },
            effects: {
                borderRadius: "0.5rem",
                shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
                transition: "all 0.2s ease-in-out",
            },
            mode: "dark" as const,
            enableAnimations: true,
            enableGradients: false,
            lightTheme: {
                colors: {
                    heading: "#1e40af",
                    subHeading: "#3b82f6",
                    text: "#1f2937",
                    primary: "#3b82f6",
                    secondary: "#64748b",
                    accent: "#0ea5e9",
                    background: "#ffffff",
                    surface: "#f8fafc",
                    border: "#e2e8f0",
                },
            },
            darkTheme: {
                colors: {
                    heading: "#f8fafc",
                    subHeading: "#cbd5e1",
                    text: "#94a3b8",
                    primary: "#3b82f6",
                    secondary: "#64748b",
                    accent: "#0ea5e9",
                    background: "#0f172a",
                    surface: "#1e293b",
                    border: "#334155",
                },
            },
        },
    },
    {
        id: "aqua-teal",
        name: "Aqua Teal",
        description: "Modern and fresh aqua-teal theme",
        preview: {
            primary: "#0d9488",
            secondary: "#14b8a6",
            accent: "#5eead4",
            background: "#ecfdf5",
            surface: "#d1fae5"
        },
        theme: {
            colors: {
                heading: "#0f766e",
                subHeading: "#0d9488",
                text: "#134e4a",
                primary: "#0d9488",
                secondary: "#14b8a6",
                accent: "#5eead4",
                background: "#ecfdf5",
                surface: "#d1fae5",
                border: "#99f6e4"
            },
            fonts: {
                heading: "Ubuntu, sans-serif",
                body: "Nunito Sans, sans-serif"
            },
            typography: {
                headingSize: "3xl",
                subHeadingSize: "xl",
                bodySize: "base",
                smallSize: "sm"
            },
            spacing: {
                sectionPadding: "3rem",
                elementSpacing: "1.25rem",
                containerMaxWidth: "1280px"
            },
            effects: {
                borderRadius: "0.75rem",
                shadow: "0 6px 10px rgba(0,0,0,0.1)",
                transition: "all 0.25s ease-in-out"
            },
            mode: "light",
            enableAnimations: true,
            enableGradients: false,
            lightTheme: {
                colors: {
                    heading: "#0f766e",
                    subHeading: "#0d9488",
                    text: "#134e4a",
                    primary: "#0d9488",
                    secondary: "#14b8a6",
                    accent: "#5eead4",
                    background: "#ecfdf5",
                    surface: "#d1fae5",
                    border: "#99f6e4"
                }
            },
            darkTheme: {
                colors: {
                    heading: "#a7f3d0",
                    subHeading: "#5eead4",
                    text: "#ccfbf1",
                    primary: "#0d9488",
                    secondary: "#14b8a6",
                    accent: "#5eead4",
                    background: "#134e4a",
                    surface: "#115e59",
                    border: "#0f766e"
                }
            }
        }
    },
    {
        id: "neon-violet",
        name: "Neon Violet",
        description: "Bold and electric violet theme",
        preview: {
            primary: "#a855f7",
            secondary: "#9333ea",
            accent: "#c084fc",
            background: "#fdf4ff",
            surface: "#fae8ff"
        },
        theme: {
            colors: {
                heading: "#7e22ce",
                subHeading: "#a855f7",
                text: "#4c1d95",
                primary: "#a855f7",
                secondary: "#9333ea",
                accent: "#c084fc",
                background: "#fdf4ff",
                surface: "#fae8ff",
                border: "#e9d5ff"
            },
            fonts: {
                heading: "Raleway, sans-serif",
                body: "Lato, sans-serif"
            },
            typography: {
                headingSize: "4xl",
                subHeadingSize: "2xl",
                bodySize: "lg",
                smallSize: "base"
            },
            spacing: {
                sectionPadding: "4rem",
                elementSpacing: "2rem",
                containerMaxWidth: "1280px"
            },
            effects: {
                borderRadius: "1rem",
                shadow: "0 8px 20px rgba(128, 90, 213, 0.15)",
                transition: "all 0.3s ease"
            },
            mode: "light",
            enableAnimations: true,
            enableGradients: true,
            lightTheme: {
                colors: {
                    heading: "#7e22ce",
                    subHeading: "#a855f7",
                    text: "#4c1d95",
                    primary: "#a855f7",
                    secondary: "#9333ea",
                    accent: "#c084fc",
                    background: "#fdf4ff",
                    surface: "#fae8ff",
                    border: "#e9d5ff"
                }
            },
            darkTheme: {
                colors: {
                    heading: "#f3e8ff",
                    subHeading: "#e9d5ff",
                    text: "#c4b5fd",
                    primary: "#a855f7",
                    secondary: "#9333ea",
                    accent: "#c084fc",
                    background: "#2e1065",
                    surface: "#3b0764",
                    border: "#5b21b6"
                }
            }
        }
    },
    {
        id: "sunset-coral",
        name: "Sunset Coral",
        description: "Warm, soft sunset-inspired theme",
        preview: {
            primary: "#fb7185",
            secondary: "#f97316",
            accent: "#fcd34d",
            background: "#fff7ed",
            surface: "#ffe4e6"
        },
        theme: {
            colors: {
                heading: "#be123c",
                subHeading: "#fb7185",
                text: "#7f1d1d",
                primary: "#fb7185",
                secondary: "#f97316",
                accent: "#fcd34d",
                background: "#fff7ed",
                surface: "#ffe4e6",
                border: "#fecdd3"
            },
            fonts: {
                heading: "Quicksand, sans-serif",
                body: "Open Sans, sans-serif"
            },
            typography: {
                headingSize: "3xl",
                subHeadingSize: "xl",
                bodySize: "base",
                smallSize: "sm"
            },
            spacing: {
                sectionPadding: "3.5rem",
                elementSpacing: "1.5rem",
                containerMaxWidth: "1140px"
            },
            effects: {
                borderRadius: "0.75rem",
                shadow: "0 6px 12px rgba(255, 182, 193, 0.15)",
                transition: "all 0.2s ease"
            },
            mode: "light",
            enableAnimations: true,
            enableGradients: false,
            lightTheme: {
                colors: {
                    heading: "#be123c",
                    subHeading: "#fb7185",
                    text: "#7f1d1d",
                    primary: "#fb7185",
                    secondary: "#f97316",
                    accent: "#fcd34d",
                    background: "#fff7ed",
                    surface: "#ffe4e6",
                    border: "#fecdd3"
                }
            },
            darkTheme: {
                colors: {
                    heading: "#fecdd3",
                    subHeading: "#fda4af",
                    text: "#ffe4e6",
                    primary: "#fb7185",
                    secondary: "#f97316",
                    accent: "#fcd34d",
                    background: "#7f1d1d",
                    surface: "#831843",
                    border: "#9f1239"
                }
            }
        }
    }
]

// Supported fonts
export const SUPPORTED_FONTS = [
    { value: "Inter, sans-serif", label: "Inter" },
    { value: "Poppins, sans-serif", label: "Poppins" },
    { value: "Roboto, sans-serif", label: "Roboto" },
    { value: "Open Sans, sans-serif", label: "Open Sans" },
    { value: "Lato, sans-serif", label: "Lato" },
    { value: "Montserrat, sans-serif", label: "Montserrat" },
    { value: "Source Sans Pro, sans-serif", label: "Source Sans Pro" },
    { value: "Nunito, sans-serif", label: "Nunito" },
    { value: "Ubuntu, sans-serif", label: "Ubuntu" },
    { value: "Playfair Display, serif", label: "Playfair Display" },
    { value: "Merriweather, serif", label: "Merriweather" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Times New Roman, serif", label: "Times New Roman" },
]

// Font sizes
export const FONT_SIZES = [
    { value: "xs", label: "Extra Small (12px)" },
    { value: "sm", label: "Small (14px)" },
    { value: "base", label: "Base (16px)" },
    { value: "lg", label: "Large (18px)" },
    { value: "xl", label: "Extra Large (20px)" },
    { value: "2xl", label: "2XL (24px)" },
    { value: "3xl", label: "3XL (30px)" },
    { value: "4xl", label: "4XL (36px)" },
    { value: "5xl", label: "5XL (48px)" },
]

// Shadow presets
export const SHADOW_PRESETS = [
    { value: "none", label: "None" },
    { value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", label: "Subtle" },
    { value: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)", label: "Light" },
    { value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", label: "Medium" },
    { value: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", label: "Large" },
    { value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", label: "Extra Large" },
]

// Border radius presets
export const BORDER_RADIUS_PRESETS = [
    { value: "0", label: "None" },
    { value: "0.25rem", label: "Small (4px)" },
    { value: "0.5rem", label: "Medium (8px)" },
    { value: "0.75rem", label: "Large (12px)" },
    { value: "1rem", label: "Extra Large (16px)" },
    { value: "9999px", label: "Full (Rounded)" },
]

// Transition presets
export const TRANSITION_PRESETS = [
    { value: "none", label: "None" },
    { value: "all 0.15s ease-in-out", label: "Fast" },
    { value: "all 0.2s ease-in-out", label: "Normal" },
    { value: "all 0.3s ease-in-out", label: "Slow" },
    { value: "all 0.5s ease-in-out", label: "Very Slow" },
]