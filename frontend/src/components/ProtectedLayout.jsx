'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/authStore'
import NavBar from './NavBar'

export default function ProtectedLayout({ children }) {
  const token  = useAuthStore(s => s.token)
  const router = useRouter()

  useEffect(() => {
    if (!token) router.push('/login')
  }, [token, router])

  // Don't flash protected content before redirect fires
  if (!token) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main>{children}</main>
    </div>
  )
}
