'use client'

import { createContext, useContext, useCallback, useSyncExternalStore, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: number
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    login: (token: string, user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Funções para useSyncExternalStore - Token
function subscribe(callback: () => void) {
    window.addEventListener('storage', callback)
    return () => window.removeEventListener('storage', callback)
}

function getTokenSnapshot() {
    return localStorage.getItem('token')
}

function getUserSnapshot() {
    return localStorage.getItem('user')
}

function getServerSnapshot() {
    return null
}

// Funções para detectar hidratação
let isHydrated = false
const hydrationListeners = new Set<() => void>()

function subscribeHydration(callback: () => void) {
    hydrationListeners.add(callback)
    return () => hydrationListeners.delete(callback)
}

function getHydrationSnapshot() {
    return isHydrated
}

function getHydrationServerSnapshot() {
    return false
}

// Marca como hidratado (chamado uma vez no cliente)
if (typeof window !== 'undefined') {
    isHydrated = true
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter()

    // Detecta hidratação
    const hydrated = useSyncExternalStore(
        subscribeHydration,
        getHydrationSnapshot,
        getHydrationServerSnapshot
    )

    // Sincroniza com localStorage de forma reativa
    const token = useSyncExternalStore(subscribe, getTokenSnapshot, getServerSnapshot)
    const userStr = useSyncExternalStore(subscribe, getUserSnapshot, getServerSnapshot)
    const user: User | null = userStr ? JSON.parse(userStr) : null

    const login = useCallback((newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
        window.dispatchEvent(new Event('storage'))
        router.push('/dashboard')
    }, [router])

    const logout = useCallback(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.dispatchEvent(new Event('storage'))
        router.push('/login')
    }, [router])

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoading: !hydrated,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider')
    }
    return context
}