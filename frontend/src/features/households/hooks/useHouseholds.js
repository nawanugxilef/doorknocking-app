import { useState, useEffect } from 'react'
import { fetchHouseholds, updateHousehold } from '../services/householdsApi'
import { cacheHouseholds, getLocalHouseholds, updateHouseholdLocally } from '../services/householdsOffline'
import { useOnlineStatus } from '../../../shared/hooks/useOnlineStatus'

export function useHouseholds() {
  const [households, setHouseholds] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const isOnline                    = useOnlineStatus()

  useEffect(() => { load() }, [isOnline])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      if (isOnline) {
        const data = await fetchHouseholds()
        setHouseholds(data)
        await cacheHouseholds(data)       // keep local cache fresh
      } else {
        const local = await getLocalHouseholds()
        setHouseholds(local)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load households')
    } finally {
      setLoading(false)
    }
  }

  async function changeStatus(id, status) {
    // Optimistic update
    setHouseholds(prev =>
      prev.map(hh => (hh.id === id ? { ...hh, status } : hh))
    )
    if (isOnline) {
      await updateHousehold(id, { status })
    } else {
      await updateHouseholdLocally(id, { status })
    }
  }

  return { households, loading, error, reload: load, changeStatus }
}
