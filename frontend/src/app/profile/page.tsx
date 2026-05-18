"use client";

import {
  BarChart3,
  ClipboardList,
  Home,
  LogOut,
  MapPinned,
  Save,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { apiRequest, UserResponse } from "@/lib/api";
import { clearSession, getSession, saveUser } from "@/lib/session";

const navItems = [
  { label: "Runsheet", icon: ClipboardList },
  { label: "Households", icon: Home },
  { label: "Volunteers", icon: UsersRound },
  { label: "Map", icon: MapPinned },
  { label: "Analyse", icon: BarChart3 },
];

export default function ProfilePage() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      window.location.href = "/";
      return;
    }

    apiRequest<UserResponse>("/api/users/me", {
      token: session.token,
    })
      .then((profile) => {
        setUser(profile);
        saveUser(profile);
      })
      .catch(() => {
        clearSession();
        window.location.href = "/";
      });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    const session = getSession();
    if (!session) return;

    setIsSaving(true);
    setMessage("");

    try {
      const updated = await apiRequest<UserResponse>("/api/users/me", {
        method: "PUT",
        token: session.token,
        body: JSON.stringify({
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          address: user.address,
        }),
      });
      setUser(updated);
      saveUser(updated);
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save profile");
    } finally {
      setIsSaving(false);
    }
  }

  function logout() {
    clearSession();
    window.location.href = "/";
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5f5f1] text-slate-700">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f1] p-4 text-slate-950 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-[280px_1fr]">
        <aside className="hidden flex-col bg-[#071d68] p-7 text-white lg:flex">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-full bg-yellow-300 text-xl">
              ✦
            </div>
            <span className="text-2xl font-bold">Doorknock</span>
          </div>

          <nav className="mt-14 space-y-2">
            {navItems.map((item, index) => (
              <button
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  index === 0 ? "bg-white text-[#071d68]" : "text-blue-50 hover:bg-white/10"
                }`}
                key={item.label}
                type="button"
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full bg-white text-[#071d68]">
                <UserRound size={26} />
              </div>
              <div>
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-blue-100">{formatRole(user.role)}</p>
              </div>
            </div>
            <button
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-blue-50 hover:bg-white/10"
              type="button"
            >
              <Settings size={19} />
              Settings
            </button>
            {(user.role === "ADMIN" || user.role === "VOLUNTEER_COORDINATOR") && (
              <Link
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-blue-50 hover:bg-white/10"
                href="/admin/users"
              >
                <UsersRound size={19} />
                Manage Users
              </Link>
            )}
            <button
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-red-200 hover:bg-white/10"
              onClick={logout}
              type="button"
            >
              <LogOut size={19} />
              Log Out
            </button>
          </div>
        </aside>

        <section className="p-6 sm:p-10">
          <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-[#071d68]">
                <ShieldCheck size={17} />
                Authenticated profile
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Profile settings
              </h1>
            </div>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
              onClick={logout}
              type="button"
            >
              <LogOut size={18} />
              Log out
            </button>
          </div>

          <div className="grid gap-8 pt-8 xl:grid-cols-[1fr_340px]">
            <form
              className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Full name"
                  onChange={(value) => setUser({ ...user, fullName: value })}
                  value={user.fullName}
                />
                <Input label="Email" readOnly value={user.email} />
                <Input
                  label="Phone number"
                  onChange={(value) => setUser({ ...user, phoneNumber: value })}
                  value={user.phoneNumber ?? ""}
                />
                <Input label="Role" readOnly value={formatRole(user.role)} />
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Address
                  </span>
                  <textarea
                    className="min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#071d68] focus:ring-4 focus:ring-blue-100"
                    onChange={(event) =>
                      setUser({ ...user, address: event.target.value })
                    }
                    value={user.address ?? ""}
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#071d68] px-5 font-semibold text-white transition hover:bg-[#0b287f] disabled:opacity-70"
                  disabled={isSaving}
                  type="submit"
                >
                  <Save size={18} />
                  {isSaving ? "Saving..." : "Save profile"}
                </button>
                {message && <p className="text-sm text-slate-600">{message}</p>}
              </div>
            </form>

            <aside className="rounded-3xl bg-[#fff09a] p-6 shadow-lg shadow-slate-200">
              <p className="text-sm font-semibold text-slate-700">Current account</p>
              <h2 className="mt-4 text-2xl font-semibold">{user.fullName}</h2>
              <div className="mt-5 space-y-3 text-sm">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {formatRole(user.role)}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phoneNumber || "Not set"}
                </p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({
  label,
  onChange,
  readOnly = false,
  value,
}: {
  label: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  value: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition read-only:bg-slate-50 read-only:text-slate-500 focus:border-[#071d68] focus:ring-4 focus:ring-blue-100"
        onChange={(event) => onChange?.(event.target.value)}
        readOnly={readOnly}
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
