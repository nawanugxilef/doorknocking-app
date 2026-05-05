import ProtectedLayout from '../../src/components/ProtectedLayout'
import UsersPage from '../../src/features/users/pages/UsersPage'

export default function UsersRoute() {
  return (
    <ProtectedLayout>
      <UsersPage />
    </ProtectedLayout>
  )
}
