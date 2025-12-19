'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { token, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return // Espera hidratar

    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [token, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
    </div>
  )
}