// ── PERSON A: Build this page ─────────────────────────────────────────────────
// This page is for admins/coordinators to manage team members.
//
// Suggested features:
//   - List all users (call fetchAllUsers from usersApi)
//   - Show role badge (admin / coordinator / doorknocker)
//   - Admin can change a user's role (PATCH /users/{id})
//   - Admin can remove a user (DELETE /users/{id})
//
// See HouseholdsPage.jsx for a complete working example to follow.
// ─────────────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Team Members</h1>
      <p className="text-gray-400 text-sm">
        TODO (Person A): Build user management UI here.
      </p>
    </div>
  )
}
