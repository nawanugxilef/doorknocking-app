import client from '../../../api/client'

/**
 * GET /api/households/
 */
export async function fetchHouseholds() {
  const { data } = await client.get('/households/')
  return data
}

/**
 * GET /api/households/:id
 */
export async function fetchHousehold(id) {
  const { data } = await client.get(`/households/${id}`)
  return data
}

/**
 * POST /api/households/
 */
export async function createHousehold(householdData) {
  const { data } = await client.post('/households/', householdData)
  return data
}

/**
 * PATCH /api/households/:id
 */
export async function updateHousehold(id, updates) {
  const { data } = await client.patch(`/households/${id}`, updates)
  return data
}

/**
 * DELETE /api/households/:id
 */
export async function deleteHousehold(id) {
  await client.delete(`/households/${id}`)
}

/**
 * POST /api/households/import/csv
 * TODO (Person B): wire up the CSV file upload UI
 */
export async function importHouseholdsCSV(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await client.post('/households/import/csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
