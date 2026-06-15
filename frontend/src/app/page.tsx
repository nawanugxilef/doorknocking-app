"use client";

import {
  ArrowLeft,
  ClipboardList,
  Loader2,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { FormEvent, useMemo, useState } from "react";
import { apiRequest, AuthResponse, RegisterResponse } from "@/lib/api";
import { saveSession } from "@/lib/session";

type AuthMode = "login" | "register";

export default function HomePage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [verification, setVerification] = useState<RegisterResponse | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const showVerification = mode === "register" && verification !== null;
  const submitLabel = useMemo(() => {
    if (showVerification) return "Back to sign in";
    return mode === "login" ? "Sign in" : "Create account";
  }, [mode, showVerification]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      if (showVerification) {
        switchMode("login");
        return;
      }

      if (mode === "login") {
        const response = await apiRequest<AuthResponse>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        saveSession(response);
        window.location.assign("/profile");
        return;
      }

      const response = await apiRequest<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setVerification(response);
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function resendVerification() {
    if (!verification?.email) return;
    setIsResending(true);
    setMessage("");

    try {
      const response = await apiRequest<RegisterResponse>("/api/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: verification.email }),
      });
      setVerification(response);
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to resend code");
    } finally {
      setIsResending(false);
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage("");
    setVerification(null);
  }

  function resetVerification() {
    setVerification(null);
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1160px] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[0.68fr_1fr]">
        <section className="flex flex-col bg-[#071d68] px-7 py-8 text-white sm:px-9 sm:py-10">
          <Logo />

          <div className="mt-16 max-w-[240px]">
            <h1 className="text-[34px] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-[46px]">
              Doorknocking Web Application
            </h1>
            <p className="mt-4 text-[13px] leading-5 text-blue-100">
              Login for admins, volunteer coordinators, and doorknockers.
              Built to connect cleanly with households, runsheets, and map.
            </p>
          </div>

          <div className="mt-auto grid gap-3 pt-10 text-sm text-blue-50">
            {[
              ["Protected profile", UserRound],
              ["Admin-ready roles", ShieldCheck],
              ["Task modules next", ClipboardList],
            ].map(([label, Icon]) => (
              <div
                className="flex h-12 items-center gap-3 rounded-[14px] bg-white/10 px-4"
                key={label as string}
              >
                <Icon size={16} />
                <span className="text-[13px]">{label as string}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[420px]">
            <div className="grid grid-cols-2 rounded-full bg-[#e9edf3] p-1">
              {(["login", "register"] as const).map((item) => (
                <button
                  className={`h-11 rounded-full text-sm font-medium transition ${
                    mode === item ? "bg-[#071d68] text-white" : "text-slate-500"
                  }`}
                  key={item}
                  onClick={() => switchMode(item)}
                  type="button"
                >
                  {item === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              {showVerification ? (
                <>
                  <div className="space-y-2">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#071d68]/70">
                      Check your inbox
                    </p>
                    <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-slate-950">
                      Open the verification link
                    </h2>
                    <p className="text-sm leading-6 text-slate-500">
                      We sent a verification email to{" "}
                      <span className="font-semibold text-slate-800">{verification.email}</span>.
                      Open the link in that email to activate your account, then come back here to sign in.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-600"
                      onClick={resetVerification}
                      type="button"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                    <button
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-600 disabled:opacity-60"
                      disabled={isResending}
                      onClick={resendVerification}
                      type="button"
                    >
                      {isResending ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                      Resend email
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {mode === "register" && (
                    <>
                      <Field
                        icon={<UserRound size={16} />}
                        label="Full Name*"
                        onChange={(value) => setForm({ ...form, fullName: value })}
                        placeholder="Anthony Charles"
                        value={form.fullName}
                      />
                      <Field
                        icon={<UserRound size={16} />}
                        label="Phone Number*"
                        onChange={(value) => setForm({ ...form, phoneNumber: value })}
                        placeholder="0432454347"
                        value={form.phoneNumber}
                      />
                      <label className="block">
                        <span className="mb-2 block text-[13px] font-semibold text-slate-700">
                          Address (Optional)
                        </span>
                        <textarea
                          className="min-h-[92px] w-full resize-none rounded-[16px] border border-[#e3e7ef] bg-white px-4 py-3 text-[14px] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#071d68]"
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
                    icon={<Mail size={16} />}
                    label="Email*"
                    onChange={(value) => setForm({ ...form, email: value })}
                    placeholder="anthony@doorknock.org"
                    type="email"
                    value={form.email}
                  />
                  <Field
                    icon={<LockKeyhole size={16} />}
                    label="Password*"
                    onChange={(value) => setForm({ ...form, password: value })}
                    placeholder="Minimum 8 Characters"
                    type="password"
                    value={form.password}
                  />
                </>
              )}

              {message && (
                <p className="rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {message}
                </p>
              )}

              <button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#071d68] px-5 text-sm font-semibold text-white transition hover:bg-[#0b287f] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isLoading}
                type="submit"
              >
                {isLoading && <Loader2 className="animate-spin" size={16} />}
                {submitLabel}
              </button>

              {!showVerification && mode === "register" && (
                <p className="text-center text-xs leading-5 text-slate-400">
                  Public sign up creates a volunteer account first. Email verification is required before access is granted.
                </p>
              )}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-5 place-items-center rounded-full bg-[#f4c542] text-[10px] font-bold text-[#071d68]">
        ✦
      </div>
      <span className="text-[18px] font-semibold tracking-[-0.02em]">Doorknock</span>
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
      <span className="mb-2 block text-[13px] font-semibold text-slate-700">
        {label}
      </span>
      <span className="flex h-11 items-center gap-3 rounded-[16px] border border-[#e3e7ef] bg-white px-4 text-slate-300 transition focus-within:border-[#071d68]">
        {icon}
        <input
          className="min-w-0 flex-1 bg-transparent text-[14px] text-slate-900 outline-none placeholder:text-slate-300"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      </span>
    </label>
  );
}
