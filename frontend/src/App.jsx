import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Auth
import LoginPage from './features/users/pages/LoginPage'

// Placeholder pages — each person builds their own
import HouseholdsPage from './features/households/pages/HouseholdsPage'  // Person B — working example
import { VisitsPage }       from './features/visits'        // Person C
import { TasksPage }        from './features/tasks'         // Person D
import { AnnouncementsPage} from './features/announcements' // Person D
import UsersPage            from './features/users/pages/UsersPage' // Person A

/**
 * ProtectedRoute — redirect to /login if not authenticated.
 * Wrap any route that needs a logged-in user.
 */
function ProtectedRoute({ children }) {
  const token = useAuthStore(s => s.token)
  return token ? children : <Navigate to="/login" replace />
}

/**
 * Simple nav bar shown on protected pages.
 * TODO (Person A or any): replace with a proper nav component once the team
 * agrees on the layout.
 */
function NavBar() {
  const { user, logout } = useAuthStore()
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
      <span className="font-bold text-lg">🚪 Doorknock</span>
      <div className="flex items-center gap-4 text-sm">
        <a href="/households" className="hover:underline">Households</a>
        <a href="/visits"     className="hover:underline">Visits</a>
        <a href="/tasks"      className="hover:underline">Tasks</a>
        {user?.role !== 'doorknocker' && (
          <a href="/announcements" className="hover:underline">Announcements</a>
        )}
        <button onClick={logout} className="hover:underline opacity-80">
          Sign out ({user?.name || 'me'})
        </button>
      </div>
    </nav>
  )
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected — wrap each in ProtectedRoute + Layout */}
        <Route
          path="/households"
          element={
            <ProtectedRoute>
              <Layout><HouseholdsPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/visits"
          element={
            <ProtectedRoute>
              <Layout><VisitsPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Layout><TasksPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <Layout><AnnouncementsPage /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout><UsersPage /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/households" replace />} />
        <Route path="*" element={<Navigate to="/households" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
