"use client";

import Link from "next/link";
import { Loader2, MailCheck, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiRequest, VerifyEmailResponse } from "@/lib/api";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Verifying your email...");

  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("token") ?? "";
  }, []);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("Verification link is missing or invalid.");
        return;
      }

      try {
        const response = await apiRequest<VerifyEmailResponse>("/api/auth/verify-email", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
        setStatus("success");
        setMessage(response.message);
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to verify email.");
      }
    }

    verify();
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4 py-8">
      <section className="w-full max-w-[440px] rounded-[22px] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div
          className={`mx-auto flex size-16 items-center justify-center rounded-full ${
            status === "success" ? "bg-emerald-50 text-emerald-600" : status === "error" ? "bg-rose-50 text-rose-500" : "bg-slate-100 text-slate-500"
          }`}
        >
          {status === "loading" ? (
            <Loader2 className="animate-spin" size={28} />
          ) : status === "success" ? (
            <MailCheck size={28} />
          ) : (
            <TriangleAlert size={28} />
          )}
        </div>

        <h1 className="mt-5 text-[28px] font-semibold tracking-[-0.02em] text-slate-950">
          {status === "success" ? "Email verified" : status === "error" ? "Verification failed" : "Verifying email"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>

        <Link
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#071d68] px-6 text-sm font-semibold text-white transition hover:bg-[#0b287f]"
          href="/"
        >
          Go to sign in
        </Link>
      </section>
    </main>
  );
}
