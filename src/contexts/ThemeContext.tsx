'use client'

import { createContext, useContext, useCallback, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function subscribeToTheme(callback: () => void) {
    window.addEventListener('storage', callback)
    return () => window.removeEventListener('storage', callback)
}

function getThemeSnapshot(): Theme {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem('theme') as Theme
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getServerSnapshot(): Theme {
    return 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot)

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        localStorage.setItem('theme', newTheme)

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        window.dispatchEvent(new Event('storage'))
    }, [theme])

    if (typeof window !== 'undefined') {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}