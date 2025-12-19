'use client'

import { useState } from 'react'
import { authApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('As senhas não coincidem')
            return
        }

        if (password.length < 8) {
            setError('A senha deve ter no mínimo 8 caracteres')
            return
        }

        setIsLoading(true)

        try {
            await authApi.register({ name, email, password })
            router.push('/login?registered=true')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar conta')
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
                    Crie sua conta
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="label">
                            Nome
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="input"
                            placeholder="Seu nome"
                        />
                    </div>

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
                            placeholder="Mínimo 8 caracteres"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="label">
                            Confirmar Senha
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="input"
                            placeholder="Repita a senha"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary"
                    >
                        {isLoading ? 'Criando conta...' : 'Criar conta'}
                    </button>
                </form>

                <p className="text-center text-sm text-value">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="text-primary-ui-blue hover:underline font-semibold">
                        Faça login
                    </Link>
                </p>
            </div>
        </div>
    )
}