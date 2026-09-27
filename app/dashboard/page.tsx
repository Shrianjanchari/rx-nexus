"use client";

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock3,
  ArrowRight,
  AlertTriangle,
  Pill,
  UserRound,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { useRefills } from "../context/RefillContext";

export default function Dashboard() {
  const {
    refills,
    events,
  } = useRefills();

  const activeRefills = refills.filter(
    (refill) => refill.status !== "COMPLETED"
  ).length;

  const needsAction = refills.filter(
    (refill) =>
      refill.status === "PROVIDER_REVIEW" ||
      refill.status === "BLOCKED"
  ).length;

  const blocked = refills.filter(
    (refill) =>
      refill.status === "BLOCKED" ||
      refill.status === "MORE_INFO_REQUIRED" ||
      refill.status === "VISIT_REQUIRED"
  ).length;

  const resolved = refills.filter(
    (refill) =>
      refill.status === "APPROVED" ||
      refill.status === "PHARMACY_FULFILLMENT" ||
      refill.status === "PATIENT_NOTIFIED" ||
      refill.status === "COMPLETED"
  ).length;

  const attentionRefills = refills.filter(
    (refill) =>
      refill.status === "PROVIDER_REVIEW" ||
      refill.status === "BLOCKED"
  );

  const recentEvents = events
    .slice()
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-8">
          <div className="mb-8">
            <p className="text-sm font-medium text-blue-600">
              Good morning, Sarah
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Refill operations
            </h1>

            <p className="mt-2 text-slate-500">
              Monitor, coordinate and resolve prescription refill
              requests.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-5">
            <StatCard
              title="Active Refills"
              value={String(activeRefills)}
              description="Currently in workflow"
              icon={Activity}
            />

            <StatCard
              title="Needs Action"
              value={String(needsAction)}
              description="Require staff or provider action"
              icon={AlertCircle}
            />

            <StatCard
              title="Blocked"
              value={String(blocked)}
              description="Requests currently blocked"
              icon={Clock3}
            />

            <StatCard
              title="Resolved"
              value={String(resolved)}
              description="Moved past provider review"
              icon={CheckCircle2}
            />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Needs Attention
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Refill requests that currently require action.
                  </p>
                </div>

                <Link
                  href="/providers"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View provider workspace
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {attentionRefills.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <CheckCircle2
                      size={36}
                      className="mx-auto text-emerald-500"
                    />

                    <p className="mt-3 font-semibold text-slate-800">
                      No refill needs attention
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      All current refill requests are moving through
                      the workflow.
                    </p>
                  </div>
                ) : (
                  attentionRefills
                    .slice(0, 5)
                    .map((refill) => (
                      <div
                        key={refill.id}
                        className="flex items-center justify-between px-6 py-5 transition hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 font-semibold text-slate-600">
                            {refill.patient
                              .split(" ")
                              .map((name) => name[0])
                              .join("")}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {refill.patient}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {refill.medication}
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                              <AlertTriangle
                                size={15}
                                className="text-amber-500"
                              />

                              <span className="text-sm text-slate-600">
                                {refill.blocker}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                refill.priority === "High"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {refill.priority}
                            </span>

                            <p className="mt-2 text-xs text-slate-400">
                              {refill.requested}
                            </p>
                          </div>

                          <Link
                            href={`/refills/${refill.id}`}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                          >
                            Review
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                    <Activity size={18} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Live activity
                    </h2>

                    <p className="text-xs text-slate-400">
                      Latest workflow events
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {recentEvents.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <p className="text-sm text-slate-400">
                      No activity yet.
                    </p>
                  </div>
                ) : (
                  recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="px-5 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          {getEventIcon(event.status)}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800">
                            {event.title}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                            {event.description}
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                              {event.actor}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              {formatEventTime(
                                event.timestamp
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-100 px-5 py-4">
                <Link
                  href="/refills"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all refills
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-5">
            <DashboardFeature
              icon={<Activity size={19} />}
              title="Workflow visibility"
              description="Every refill has an owner and next action."
              className="bg-blue-50 text-blue-600"
            />

            <DashboardFeature
              icon={<AlertCircle size={19} />}
              title="AI-assisted routing"
              description="Blockers are translated into workflow actions."
              className="bg-purple-50 text-purple-600"
            />

            <DashboardFeature
              icon={<CheckCircle2 size={19} />}
              title="Resolution tracking"
              description="Measure progress from request to completion."
              className="bg-emerald-50 text-emerald-600"
            />
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                  <RefreshCw size={19} />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Connected workflow
                  </p>

                  <p className="text-xs text-slate-400">
                    Changes made by one role appear across the system.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Synchronized
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function getEventIcon(status: string) {
  if (status === "APPROVED") {
    return <CheckCircle2 size={14} />;
  }

  if (status === "PHARMACY_FULFILLMENT") {
    return <Pill size={14} />;
  }

  if (
    status === "PATIENT_NOTIFIED"
  ) {
    return <UserRound size={14} />;
  }

  if (status === "COMPLETED") {
    return <CheckCircle2 size={14} />;
  }

  if (
    status === "BLOCKED" ||
    status === "MORE_INFO_REQUIRED" ||
    status === "VISIT_REQUIRED"
  ) {
    return <AlertCircle size={14} />;
  }

  return <Activity size={14} />;
}

function formatEventTime(timestamp: string) {
  const date = new Date(timestamp);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function DashboardFeature({
  icon,
  title,
  description,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2 ${className}`}>
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>

          <p className="text-xs text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}