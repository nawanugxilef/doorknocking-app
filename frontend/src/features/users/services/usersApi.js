import client from '../../../api/client'

/**
 * POST /api/users/login
 * Returns { access_token, token_type, user }
 */
export async function loginUser(email, password) {
  const { data } = await client.post('/users/login', { email, password })
  return data
}

/**
 * GET /api/users/me
 * Returns current user from token
 */
export async function fetchMe() {
  const { data } = await client.get('/users/me')
  return data
}

/**
 * POST /api/users/register
 * Admin creates a new user account
 */
export async function registerUser(userData) {
  const { data } = await client.post('/users/register', userData)
  return data
}

/**
 * GET /api/users/
 * All users — admin/coordinator only
 */
export async function fetchAllUsers() {
  const { data } = await client.get('/users/')
  return data
}

/**
 * GET /api/users/doorknockers
 * Only doorknocker-role users — admin/coordinator only
 */
export async function fetchDoorknockers() {
  const { data } = await client.get('/users/doorknockers')
  return data
}

// TODO (Person A): add updateUser(id, data) and deleteUser(id) when backend is ready
