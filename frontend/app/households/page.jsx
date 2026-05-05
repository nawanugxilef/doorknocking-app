import ProtectedLayout from '../../src/components/ProtectedLayout'
import HouseholdsPage from '../../src/features/households/pages/HouseholdsPage'

export default function HouseholdsRoute() {
  return (
    <ProtectedLayout>
      <HouseholdsPage />
    </ProtectedLayout>
  )
}
