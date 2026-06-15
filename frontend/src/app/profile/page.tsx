"use client";

import {
  BarChart3,
  ClipboardList,
  Home,
  LogOut,
  MapPinned,
  Menu,
  Settings,
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
      window.location.assign("/");
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
        window.location.assign("/");
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
    window.location.assign("/");
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5f5f1] text-slate-700">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-6 text-slate-950 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1180px] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[220px_1fr]">
        <aside className="hidden flex-col bg-[#071d68] px-5 py-6 text-white lg:flex">
          <div className="flex items-center gap-2.5">
            <div className="grid size-5 place-items-center rounded-full bg-[#f4c542] text-[10px] font-bold text-[#071d68]">
              ✦
            </div>
            <span className="text-[18px] font-semibold tracking-[-0.02em]">Doorknock</span>
          </div>

          <nav className="mt-10 space-y-1.5">
            {navItems.map((item, index) => (
              <button
                className={`flex h-9 w-full items-center gap-2.5 rounded-full px-3 text-left text-[13px] transition ${
                  index === 0 ? "bg-white text-[#071d68]" : "text-blue-50 hover:bg-white/10"
                }`}
                key={item.label}
                type="button"
              >
                <item.icon size={16} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-white text-[#071d68]">
                <UserRound size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold">{user.fullName}</p>
                <p className="text-xs text-blue-100">{formatRole(user.role)}</p>
              </div>
            </div>
            <button
              className="flex h-9 items-center gap-2.5 rounded-full px-3 text-sm text-blue-50 hover:bg-white/10"
              type="button"
            >
              <Settings size={16} />
              Settings
            </button>
            {(user.role === "ADMIN" || user.role === "VOLUNTEER_COORDINATOR") && (
              <Link
                className="flex h-9 items-center gap-2.5 rounded-full px-3 text-sm text-blue-50 hover:bg-white/10"
                href="/admin/users"
              >
                <UsersRound size={16} />
                Manage Users
              </Link>
            )}
            <button
              className="flex h-9 items-center gap-2.5 rounded-full px-3 text-sm text-red-200 hover:bg-white/10"
              onClick={logout}
              type="button"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        </aside>

        <section className="px-6 py-7 sm:px-9">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#071d68]/70">
                Authenticated profile
              </p>
              <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.02em] sm:text-[42px]">
                Profile settings
              </h1>
            </div>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
              onClick={logout}
              type="button"
            >
              <Menu size={16} />
              Menu
            </button>
          </div>

          <div className="grid gap-7 pt-7 xl:grid-cols-[1fr_300px]">
            <form
              className="rounded-[22px] border border-slate-200 bg-white p-5 sm:p-6"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-4 sm:grid-cols-2">
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
                  <span className="mb-2 block text-[13px] font-semibold text-slate-700">
                    Address
                  </span>
                  <textarea
                    className="min-h-[100px] w-full resize-none rounded-[16px] border border-[#e3e7ef] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-[#071d68]"
                    onChange={(event) =>
                      setUser({ ...user, address: event.target.value })
                    }
                    value={user.address ?? ""}
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#071d68] px-6 text-sm font-semibold text-white transition hover:bg-[#0b287f] disabled:opacity-70"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? "Saving..." : "Save profile"}
                </button>
                {message && <p className="text-sm text-slate-500">{message}</p>}
              </div>
            </form>

            <aside className="rounded-[24px] bg-[#fff09a] p-6 shadow-[0_16px_28px_rgba(148,163,184,0.18)]">
              <p className="text-sm font-semibold text-slate-700">Current account</p>
              <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">{user.fullName}</h2>
              <div className="mt-5 space-y-3 text-sm leading-6">
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
      <span className="mb-2 block text-[13px] font-semibold text-slate-700">
        {label}
      </span>
      <input
        className="h-11 w-full rounded-[16px] border border-[#e3e7ef] bg-white px-4 text-[14px] outline-none transition read-only:bg-slate-50 read-only:text-slate-500 focus:border-[#071d68]"
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
