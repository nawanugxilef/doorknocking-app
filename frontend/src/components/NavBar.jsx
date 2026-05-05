'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/authStore'

export default function NavBar() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
      <span className="font-bold text-lg">🚪 Doorknock</span>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/households" className="hover:underline">Households</Link>
        <Link href="/visits"     className="hover:underline">Visits</Link>
        <Link href="/tasks"      className="hover:underline">Tasks</Link>
        <Link href="/announcements" className="hover:underline">Announcements</Link>
        {user?.role !== 'doorknocker' && (
          <Link href="/users" className="hover:underline">Users</Link>
        )}
        <button onClick={handleLogout} className="hover:underline opacity-80">
          Sign out ({user?.name || 'me'})
        </button>
      </div>
    </nav>
  )
}
