'use client'
import { useHouseholds } from '../hooks/useHouseholds'

const STATUS_COLORS = {
  not_visited:  'bg-gray-100 text-gray-700',
  visited:      'bg-green-100 text-green-700',
  callback:     'bg-yellow-100 text-yellow-700',
  do_not_knock: 'bg-red-100 text-red-700',
}

const STATUS_LABELS = {
  not_visited:  'Not Visited',
  visited:      'Visited',
  callback:     'Callback',
  do_not_knock: 'Do Not Knock',
}

export default function HouseholdsPage() {
  const { households, loading, error, reload, changeStatus } = useHouseholds()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Loading households...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={reload} className="mt-2 text-sm text-red-600 underline">
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Households</h1>
        <span className="text-sm text-gray-500">{households.length} total</span>
      </div>

      {households.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No households yet.</p>
          <p className="text-sm mt-1">Import a CSV to get started.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {households.map(hh => (
            <li
              key={hh.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{hh.address}</p>
                  <p className="text-sm text-gray-500">
                    {hh.suburb}, {hh.postcode}
                  </p>
                  {hh.notes && (
                    <p className="text-sm text-gray-400 mt-1 italic">{hh.notes}</p>
                  )}
                </div>

                {/* Status badge — click to cycle */}
                <select
                  value={hh.status}
                  onChange={e => changeStatus(hh.id, e.target.value)}
                  className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[hh.status]}`}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* TODO (Person B): Add "Import CSV" button and modal here */}
      {/* TODO (Person B): Add "Add Household" button and form here */}
    </div>
  )
}
