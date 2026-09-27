"use client";

import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRefills } from "../context/RefillContext";

export default function Analytics() {
  const { refills } = useRefills();

  const totalRefills = refills.length;

  const completed = refills.filter(
    (refill) => refill.status === "COMPLETED"
  ).length;

  const active = refills.filter(
    (refill) => refill.status !== "COMPLETED"
  ).length;

  const blocked = refills.filter(
    (refill) =>
      refill.status === "BLOCKED" ||
      refill.status === "MORE_INFO_REQUIRED" ||
      refill.status === "VISIT_REQUIRED"
  ).length;

  const providerReview = refills.filter(
    (refill) => refill.status === "PROVIDER_REVIEW"
  ).length;

  const approved = refills.filter(
    (refill) =>
      refill.status === "APPROVED" ||
      refill.status === "PHARMACY_FULFILLMENT" ||
      refill.status === "PATIENT_NOTIFIED" ||
      refill.status === "COMPLETED"
  ).length;

  const resolutionRate =
    totalRefills > 0
      ? Math.round((completed / totalRefills) * 100)
      : 0;

  const blockerData = [
    {
      name: "Provider approval",
      count: refills.filter(
        (refill) =>
          refill.status === "PROVIDER_REVIEW" &&
          refill.blocker.toLowerCase().includes("provider")
      ).length,
      color: "bg-amber-500",
    },
    {
      name: "Insurance / admin",
      count: refills.filter(
        (refill) =>
          refill.blocker.toLowerCase().includes("insurance")
      ).length,
      color: "bg-purple-500",
    },
    {
      name: "Missing information",
      count: refills.filter(
        (refill) =>
          refill.blocker.toLowerCase().includes("missing")
      ).length,
      color: "bg-blue-500",
    },
    {
      name: "No refills remaining",
      count: refills.filter(
        (refill) =>
          refill.blocker.toLowerCase().includes("no refills")
      ).length,
      color: "bg-red-500",
    },
  ];

  const maxBlockerCount = Math.max(
    ...blockerData.map((item) => item.count),
    1
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-8">
          <div className="mb-8">
            <p className="text-sm font-medium text-blue-600">
              Performance
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Refill analytics
            </h1>

            <p className="mt-2 text-slate-500">
              Measure workflow performance, identify bottlenecks and
              understand where refill resolution is slowing down.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Refills
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {totalRefills}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <ArrowUp size={13} />
                    Workflow volume
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Activity size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Resolution Rate
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {resolutionRate}%
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <ArrowUp size={13} />
                    Successfully completed
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Needs Action
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {providerReview + blocked}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-amber-600">
                    <Clock3 size={13} />
                    Awaiting action
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Clock3 size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Blocked
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {blocked}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-red-600">
                    <ArrowDown size={13} />
                    Requires intervention
                  </div>
                </div>

                <div className="rounded-xl bg-red-50 p-3 text-red-600">
                  <AlertTriangle size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                    <BarChart3 size={19} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Workflow performance
                    </h2>

                    <p className="text-sm text-slate-500">
                      Current refill distribution across workflow states.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Active workflow
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      {active}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${
                          totalRefills
                            ? (active / totalRefills) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Provider review
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      {providerReview}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{
                        width: `${
                          totalRefills
                            ? (providerReview / totalRefills) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Approved / Fulfillment
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      {approved}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{
                        width: `${
                          totalRefills
                            ? (approved / totalRefills) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Completed
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      {completed}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${
                          totalRefills
                            ? (completed / totalRefills) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-red-50 p-2 text-red-600">
                    <AlertTriangle size={19} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Top blockers
                    </h2>

                    <p className="text-sm text-slate-500">
                      Reasons refills are getting stuck.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                {blockerData.map((item) => (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {item.name}
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{
                          width: `${
                            (item.count / maxBlockerCount) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Clock3 size={21} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Avg. Resolution Time
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    4.2 hrs
                  </p>

                  <p className="mt-1 text-xs text-emerald-600">
                    Demo metric
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Users size={21} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Provider Response
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    1.8 hrs
                  </p>

                  <p className="mt-1 text-xs text-emerald-600">
                    Demo metric
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <CheckCircle2 size={21} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Successful Resolution
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {completed} / {totalRefills}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Current completed refills
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <BarChart3 size={21} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Business impact
                </h2>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                  RxNexus turns fragmented refill requests into a visible,
                  measurable workflow. Teams can identify blockers earlier,
                  assign ownership, track resolution and understand where
                  operational time is being lost.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                    Workflow visibility
                  </span>

                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                    Faster resolution
                  </span>

                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                    Fewer manual follow-ups
                  </span>

                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                    Measurable operations
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Analytics shown with synthetic/demo data for the RxNexus challenge.
          </p>
        </main>
      </div>
    </div>
  );
}