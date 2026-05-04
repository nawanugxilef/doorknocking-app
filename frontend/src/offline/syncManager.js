import { db } from './db'

// Each feature registers its own handler here
const HANDLERS = {
  // 'CREATE_VISIT': imported by visits feature
  // 'CREATE_TASK': imported by tasks feature
}

export function registerSyncHandler(type, handler) {
  HANDLERS[type] = handler
}

export async function flushSyncQueue() {
  const pending = await db.syncQueue.toArray()
  for (const item of pending) {
    try {
      const handler = HANDLERS[item.type]
      if (handler) {
        await handler(item)
        await db.syncQueue.delete(item.id)
      }
    } catch (err) {
      console.error(`Sync failed for ${item.type}:`, err)
      // Leave in queue — retry on next connection
    }
  }
}
