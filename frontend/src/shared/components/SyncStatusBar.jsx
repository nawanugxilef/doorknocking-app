import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { useSyncStore } from '../../store/syncStore'

export default function SyncStatusBar() {
  const isOnline = useOnlineStatus()
  const { pendingCount, isSyncing } = useSyncStore()

  if (isOnline && pendingCount === 0) return null

  return (
    <div className={`fixed bottom-0 left-0 right-0 text-center py-2 text-sm font-medium text-white z-50
      ${!isOnline ? 'bg-gray-600' : 'bg-yellow-600'}`}>
      {!isOnline
        ? `📴 Offline — ${pendingCount} visit${pendingCount !== 1 ? 's' : ''} pending sync`
        : isSyncing
          ? '🔄 Syncing...'
          : `⚡ ${pendingCount} item${pendingCount !== 1 ? 's' : ''} pending`}
    </div>
  )
}
