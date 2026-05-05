import ProtectedLayout from '../../src/components/ProtectedLayout'
import VisitsPage from '../../src/features/visits/pages/VisitsPage'

export default function VisitsRoute() {
  return (
    <ProtectedLayout>
      <VisitsPage />
    </ProtectedLayout>
  )
}
