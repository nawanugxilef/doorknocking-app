'use client'
// ── PERSON C: Build this page ─────────────────────────────────────────────────
// This page lets doorknockers log visits and see their visit history.
//
// Suggested features:
//   - List of households to visit (from HouseholdsPage or a filtered view)
//   - "Log Visit" button → form with outcome + notes
//   - Offline-first: if no internet, queue the visit locally (useVisits hook)
//   - Show pending (unsynced) visits with a "⏳ Pending sync" badge
//
// See HouseholdsPage.jsx for a complete working example to follow.
// See frontend/src/offline/ for how the sync queue works.
// ─────────────────────────────────────────────────────────────────────────────

export default function VisitsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Visits</h1>
      <p className="text-gray-400 text-sm">
        TODO (Person C): Build visit logging and history UI here.
      </p>
    </div>
  )
}
