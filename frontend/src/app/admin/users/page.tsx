"use client";

import { Edit3, Loader2, Save, Trash2, UsersRound, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { apiRequest, UserResponse, UserRole } from "@/lib/api";
import { clearSession, getSession } from "@/lib/session";

const roles: { label: string; value: UserRole }[] = [
  { label: "Admin", value: "ADMIN" },
  { label: "Volunteer Coordinator", value: "VOLUNTEER_COORDINATOR" },
  { label: "Volunteer / Doorknocker", value: "DOORKNOCKER" },
];

export default function AdminUsersPage() {
  const [currentUser] = useState<UserResponse | null>(() => {
    if (typeof window === "undefined") return null;
    return getSession()?.user ?? null;
  });
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    role: "DOORKNOCKER" as UserRole,
  });

  useEffect(() => {
    const session = getSession();
    if (!session) {
      window.location.href = "/";
      return;
    }

    if (!["ADMIN", "VOLUNTEER_COORDINATOR"].includes(session.user.role)) {
      window.location.href = "/profile";
      return;
    }

    loadUsers(session.token);
  }, []);

  async function loadUsers(token: string) {
    setIsLoading(true);
    try {
      setUsers(await apiRequest<UserResponse[]>("/api/admin/users", { token }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load users");
      if (error instanceof Error && error.message.includes("401")) {
        clearSession();
        window.location.href = "/";
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = getSession();
    if (!session) return;

    setIsSaving(true);
    setMessage("");

    try {
      if (!editingUserId) {
        setMessage("Select a user to edit.");
        return;
      }

      await apiRequest<UserResponse>(`/api/admin/users/${editingUserId}`, {
        method: "PUT",
        token: session.token,
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          address: form.address,
          role: form.role,
        }),
      });
      resetForm();
      setMessage("User updated.");
      await loadUsers(session.token);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create user");
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(user: UserResponse) {
    setEditingUserId(user.id);
    setMessage("");
    setForm({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber ?? "",
      address: user.address ?? "",
      role: user.role,
    });
  }

  function resetForm() {
    setEditingUserId(null);
    setForm({
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      role: "DOORKNOCKER",
    });
  }

  async function deleteUser(id: number) {
    const session = getSession();
    if (!session) return;

    setMessage("");
    try {
      await apiRequest<void>(`/api/admin/users/${id}`, {
        method: "DELETE",
        token: session.token,
      });
      await loadUsers(session.token);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete user");
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f1] p-4 text-slate-950 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] bg-[#071d68] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm text-blue-100">
              <UsersRound size={17} />
              Admin user management
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Manage team accounts</h1>
          </div>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-4 font-semibold text-[#071d68]"
            href="/profile"
          >
            Back to profile
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Save size={21} />
                {editingUserId ? "Edit user" : "Select a user"}
              </h2>
              {editingUserId && (
                <button
                  className="inline-flex size-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                  onClick={resetForm}
                  title="Cancel edit"
                  type="button"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            {editingUserId ? (
              <>
                <div className="mt-5 space-y-4">
                  <Input
                    label="Full name"
                    onChange={(value) => setForm({ ...form, fullName: value })}
                    value={form.fullName}
                  />
                  <Input
                    label="Email"
                    onChange={(value) => setForm({ ...form, email: value })}
                    type="email"
                    value={form.email}
                  />
                  <Input
                    label="Phone number"
                    onChange={(value) => setForm({ ...form, phoneNumber: value })}
                    value={form.phoneNumber}
                  />
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Role
                    </span>
                    <select
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none disabled:bg-slate-50 disabled:text-slate-500 focus:border-[#071d68] focus:ring-4 focus:ring-blue-100"
                      disabled={currentUser?.role !== "ADMIN"}
                      onChange={(event) =>
                        setForm({ ...form, role: event.target.value as UserRole })
                      }
                      value={form.role}
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Address optional
                    </span>
                    <textarea
                      className="min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#071d68] focus:ring-4 focus:ring-blue-100"
                      onChange={(event) =>
                        setForm({ ...form, address: event.target.value })
                      }
                      value={form.address}
                    />
                  </label>
                </div>
                <button
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#071d68] font-semibold text-white disabled:opacity-70"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving && <Loader2 className="animate-spin" size={18} />}
                  Save changes
                </button>
              </>
            ) : (
              <p className="mt-5 rounded-2xl bg-blue-50 px-4 py-3 text-sm leading-6 text-[#071d68]">
                New users sign up from the front page as volunteers. Admin can
                promote a volunteer into coordinator by editing their role here.
              </p>
            )}
            {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
          </form>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Current users</h2>
            {isLoading ? (
              <p className="mt-6 text-slate-500">Loading users...</p>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-3 pr-4 font-semibold">Name</th>
                      <th className="py-3 pr-4 font-semibold">Email</th>
                      <th className="py-3 pr-4 font-semibold">Role</th>
                      <th className="py-3 pr-4 font-semibold">Phone</th>
                      <th className="py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr className="border-b border-slate-100" key={user.id}>
                        <td className="py-4 pr-4 font-medium">{user.fullName}</td>
                        <td className="py-4 pr-4 text-slate-600">{user.email}</td>
                        <td className="py-4 pr-4">{formatRole(user.role)}</td>
                        <td className="py-4 pr-4 text-slate-600">
                          {user.phoneNumber || "NA"}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            className="mr-2 inline-flex size-9 items-center justify-center rounded-xl text-[#071d68] hover:bg-blue-50"
                            onClick={() => startEdit(user)}
                            title="Edit user"
                            type="button"
                          >
                            <Edit3 size={17} />
                          </button>
                          {currentUser?.role === "ADMIN" &&
                            currentUser.id !== user.id && (
                              <button
                                className="inline-flex size-9 items-center justify-center rounded-xl text-red-600 hover:bg-red-50"
                                onClick={() => deleteUser(user.id)}
                                title="Delete user"
                                type="button"
                              >
                                <Trash2 size={17} />
                              </button>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  onChange,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-[#071d68] focus:ring-4 focus:ring-blue-100"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}

function formatRole(role: string) {
  return role
    .split("_")
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(" ");
}
