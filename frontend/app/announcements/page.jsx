import ProtectedLayout from '../../src/components/ProtectedLayout'
import AnnouncementsPage from '../../src/features/announcements/pages/AnnouncementsPage'

export default function AnnouncementsRoute() {
  return (
    <ProtectedLayout>
      <AnnouncementsPage />
    </ProtectedLayout>
  )
}
