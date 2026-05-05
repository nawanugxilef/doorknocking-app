// ── PERSON D: Build this page ─────────────────────────────────────────────────
// This page shows tasks assigned to the current user (doorknocker)
// or all tasks (admin/coordinator).
//
// Suggested features:
//   - List tasks with status badge (pending / in_progress / done)
//   - Click to update status
//   - Admin/coordinator can create and assign tasks
//   - Filter by status or assignee
//
// See HouseholdsPage.jsx for a complete working example to follow.
// ─────────────────────────────────────────────────────────────────────────────

export default function TasksPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>
      <p className="text-gray-400 text-sm">
        TODO (Person D): Build task list and management UI here.
      </p>
    </div>
  )
}
