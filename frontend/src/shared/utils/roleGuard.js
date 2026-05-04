import { useAuthStore } from '../../store/authStore'

export function useRole() {
  const user = useAuthStore((s) => s.user)
  return {
    isAdmin:       user?.role === 'admin',
    isCoordinator: user?.role === 'volunteer_coordinator',
    isDoorknocker: user?.role === 'doorknocker',
    role:          user?.role,
  }
}
