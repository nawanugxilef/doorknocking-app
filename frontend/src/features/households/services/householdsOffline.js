import { db } from '../../../offline/db'

/**
 * Save a full household list to IndexedDB (replaces all)
 */
export async function cacheHouseholds(households) {
  await db.households.clear()
  await db.households.bulkPut(households)
}

/**
 * Get all households from local IndexedDB cache
 */
export async function getLocalHouseholds() {
  return db.households.toArray()
}

/**
 * Update a single household's status locally (before sync)
 */
export async function updateHouseholdLocally(id, updates) {
  return db.households.update(id, updates)
}
