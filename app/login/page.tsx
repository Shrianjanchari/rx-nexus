"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  User,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import { createClient } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const supabase = createClient();

    if (isSignUp) {
      if (!fullName.trim()) {
        setError("Please enter your full name.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        setMessage(
          "Account created successfully. Redirecting..."
        );

        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 700);
      }

      setLoading(false);
      return;
    }

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const redirect =
      searchParams.get("redirect") || "/dashboard";

    router.push(redirect);
    router.refresh();
  };

  const toggleMode = () => {
    setIsSignUp((previous) => !previous);
    setMessage("");
    setError("");
    setFullName("");
    setEmail("");
    setPassword("");
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden flex-col justify-between border-r border-white/10 bg-slate-950 p-12 text-white lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <ShieldCheck size={24} />
              </div>

              <div>
                <p className="text-xl font-bold">
                  RxNexus
                </p>

                <p className="text-xs text-slate-400">
                  Connect. Resolve. Complete.
                </p>
              </div>
            </div>

            <div className="mt-24 max-w-lg">
              <p className="text-sm font-medium text-blue-400">
                REFILL OPERATIONS PLATFORM
              </p>

              <h1 className="mt-5 text-5xl font-bold leading-tight">
                Resolve refill blockers faster.
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                RxNexus connects practices, providers,
                pharmacies, and patients around one refill
                workflow.
              </p>

              <div className="mt-8 space-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  <span>
                    See why a refill is stuck
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  <span>
                    Know who needs to act
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  <span>
                    Track every workflow step
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Synthetic demo environment
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-slate-50 p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <ShieldCheck size={24} />
                </div>

                <div>
                  <p className="text-xl font-bold text-slate-900">
                    RxNexus
                  </p>

                  <p className="text-xs text-slate-400">
                    Connect. Resolve. Complete.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
              <div className="mb-8">
                <p className="text-sm font-semibold text-blue-600">
                  RxNexus
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {isSignUp
                    ? "Create your account"
                    : "Welcome back"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {isSignUp
                    ? "Create a demo account to access the RxNexus workspace."
                    : "Sign in to your RxNexus workspace."}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {isSignUp && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        value={fullName}
                        onChange={(event) =>
                          setFullName(event.target.value)
                        }
                        placeholder="Enter your full name"
                        autoComplete="name"
                        className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete={
                        isSignUp
                          ? "new-password"
                          : "current-password"
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                      minLength={6}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Use at least 6 characters.
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <ArrowRight size={18} />
                  )}

                  {loading
                    ? "Please wait..."
                    : isSignUp
                    ? "Create Account"
                    : "Sign In"}
                </button>
              </form>

              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={toggleMode}
                className="w-full rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Need an account? Create one"}
              </button>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              RxNexus is a synthetic demonstration platform.
              Do not enter real patient or clinical information.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}