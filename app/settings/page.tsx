"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Bell,
  ShieldCheck,
  Users,
  Brain,
  Save,
  Loader2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { createClient } from "../../lib/supabase";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] =
    useState("RxNexus Demo Practice");

  const [aiRecommendations, setAiRecommendations] =
    useState(true);
  const [patientNotifications, setPatientNotifications] =
    useState(true);
  const [automaticEscalation, setAutomaticEscalation] =
    useState(true);
  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name);
        setRole(profile.role);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      setMessage("Unable to save profile.");
      setSaving(false);
      return;
    }

    setMessage("Profile saved successfully.");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2
          size={28}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-8">
          <div className="mb-8">
            <p className="text-sm text-slate-400">
              Configuration
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Settings
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your RxNexus profile and workflow preferences.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Building2 size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Organization
                  </h2>

                  <p className="text-sm text-slate-500">
                    Practice information
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Organization Name
                  </label>

                  <input
                    value={organization}
                    onChange={(e) =>
                      setOrganization(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Organization Type
                  </label>

                  <input
                    value="Physician Practice"
                    readOnly
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Users size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Your Profile
                  </h2>

                  <p className="text-sm text-slate-500">
                    Account information
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    value={email}
                    readOnly
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Role
                  </label>

                  <input
                    value={role}
                    readOnly
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Brain size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    AI Workflow
                  </h2>

                  <p className="text-sm text-slate-500">
                    Configure AI-assisted operations
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <ToggleRow
                  title="AI Resolution Recommendations"
                  description="Analyze refill blockers and suggest the next operational action."
                  enabled={aiRecommendations}
                  onChange={setAiRecommendations}
                />

                <ToggleRow
                  title="Automatic Escalation"
                  description="Escalate unresolved refill requests when configured thresholds are reached."
                  enabled={automaticEscalation}
                  onChange={setAutomaticEscalation}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Bell size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Notifications
                  </h2>

                  <p className="text-sm text-slate-500">
                    Communication preferences
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <ToggleRow
                  title="Patient Notifications"
                  description="Send refill status updates to patients."
                  enabled={patientNotifications}
                  onChange={setPatientNotifications}
                />

                <ToggleRow
                  title="Email Notifications"
                  description="Receive operational alerts by email."
                  enabled={emailNotifications}
                  onChange={setEmailNotifications}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-3">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Security and Trust
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    RxNexus is currently running as a synthetic
                    demonstration environment. No real patient,
                    prescription, insurance, or pharmacy data should
                    be entered into this challenge application.
                  </p>

                  <div className="mt-4 inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                    Synthetic Demo Environment
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-6 flex items-center justify-end gap-4">
            {message && (
              <p className="text-sm font-medium text-emerald-600">
                {message}
              </p>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save size={17} />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}