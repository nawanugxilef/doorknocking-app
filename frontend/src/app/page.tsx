"use client";

import {
  ClipboardList,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { FormEvent, useState } from "react";
import { apiRequest, AuthResponse } from "@/lib/api";
import { saveSession } from "@/lib/session";

export default function HomePage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;

      const response = await apiRequest<AuthResponse>(
        mode === "login" ? "/api/auth/login" : "/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      saveSession(response);
      window.location.href = "/profile";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f1] px-4 py-6 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex flex-col bg-[#071d68] p-8 text-white sm:p-10">
          <Logo />
          <div className="mt-14 max-w-md">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Doorknocking Web Application
            </h1>
            <p className="mt-5 text-base leading-7 text-blue-100">
              Login for admins, volunteer coordinators, and doorknockers.
              Built to connect cleanly with households, runsheets, and map.
            </p>
          </div>

          <div className="mt-auto grid gap-3 pt-12 text-sm text-blue-50">
            {[
              ["Protected profile", UserRound],
              ["Admin-ready roles", ShieldCheck],
              ["Task modules next", ClipboardList],
            ].map(([label, Icon]) => (
              <div
                className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3"
                key={label as string}
              >
                <Icon size={18} />
                <span>{label as string}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="grid grid-cols-2 rounded-full bg-slate-100 p-1">
              {(["login", "register"] as const).map((item) => (
                <button
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    mode === item
                      ? "bg-[#071d68] text-white shadow"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                  key={item}
                  onClick={() => {
                    setMode(item);
                    setMessage("");
                  }}
                  type="button"
                >
                  {item === "login" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {mode === "register" && (
                <>
                  <Field
                    icon={<UserRound size={18} />}
                    label="Full name"
                    onChange={(value) => setForm({ ...form, fullName: value })}
                    placeholder="Angus Brown"
                    value={form.fullName}
                  />
                  <Field
                    icon={<UserRound size={18} />}
                    label="Phone number"
                    onChange={(value) =>
                      setForm({ ...form, phoneNumber: value })
                    }
                    placeholder="+61 493 707 842"
                    value={form.phoneNumber}
                  />
                  <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-[#071d68]">
                    Public sign up creates a Volunteer/Doorknocker account.
                    Admins and Coordinators are created from the admin page.
                  </p>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Address optional
                    </span>
                    <textarea
                      className="min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#071d68] focus:ring-4 focus:ring-blue-100"
                      onChange={(event) =>
                        setForm({ ...form, address: event.target.value })
                      }
                      placeholder="3/40 Edinburgh Street, Sydenham"
                      value={form.address}
                    />
                  </label>
                </>
              )}

              <Field
                icon={<Mail size={18} />}
                label="Email"
                onChange={(value) => setForm({ ...form, email: value })}
                placeholder="felix@doorknock.org"
                type="email"
                value={form.email}
              />
              <Field
                icon={<LockKeyhole size={18} />}
                label="Password"
                onChange={(value) => setForm({ ...form, password: value })}
                placeholder="Minimum 8 characters"
                type="password"
                value={form.password}
              />

              {message && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {message}
                </p>
              )}

              <button
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#071d68] px-5 font-semibold text-white transition hover:bg-[#0b287f] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isLoading}
                type="submit"
              >
                {isLoading && <Loader2 className="animate-spin" size={18} />}
                {mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-12 place-items-center rounded-full bg-yellow-300 text-2xl">
        ✦
      </div>
      <span className="text-3xl font-bold tracking-tight">Doorknock</span>
    </div>
  );
}

function Field({
  icon,
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  icon: ReactNode;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <span className="flex h-[52px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-slate-400 transition focus-within:border-[#071d68] focus-within:ring-4 focus-within:ring-blue-100">
        {icon}
        <input
          className="min-w-0 flex-1 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      </span>
    </label>
  );
}
