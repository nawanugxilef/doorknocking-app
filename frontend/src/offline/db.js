import Dexie from 'dexie'

export const db = new Dexie('DoorknockingApp')

db.version(1).stores({
  visits:     '++id, household_id, volunteer_id, synced_at',
  households: '++id, address, status',
  tasks:      '++id, assigned_to, status',
  syncQueue:  '++id, type, createdAt',
})
