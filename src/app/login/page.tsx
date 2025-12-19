'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const response = await authApi.login({ email, password })
            login(response.token, response.user)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao fazer login')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">

                <div className='w-full flex justify-center items-center'>
                    <Image
                        src="/hubfy-tasks.svg"
                        alt="Hubfy Tasks Logo"
                        width={100}
                        height={100}
                    />
                </div>
                <h1 className="text-2xl font-bold text-center text-label">
                    Faça login na sua conta
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="label">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary"
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="text-center text-sm text-value">
                    Não tem uma conta?{' '}
                    <Link href="/register" className="text-primary-ui-blue hover:underline font-semibold">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    )
}