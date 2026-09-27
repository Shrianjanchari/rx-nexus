"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Activity,
  AlertCircle,
} from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import AIResolutionPanel from "../../components/AIResolutionPanel";
import { useRefills } from "../../context/RefillContext";

export default function RefillDetailPage() {
  const params = useParams();
  const refillId = String(params.id);

  const {
    getRefill,
    getRefillEvents,
  } = useRefills();

  const refill = getRefill(refillId);

  if (!refill) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <div className="ml-64">
          <Header />

          <main className="p-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <AlertCircle
                size={40}
                className="mx-auto text-red-500"
              />

              <h1 className="mt-4 text-2xl font-bold text-slate-900">
                Refill not found
              </h1>

              <Link
                href="/refills"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              >
                <ArrowLeft size={16} />
                Back to refills
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const events = getRefillEvents(refill.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-8">
          <Link
            href="/refills"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to refills
          </Link>

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {refill.id}
              </h1>

              <p className="mt-2 text-slate-500">
                {refill.patient} · {refill.medication}
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {refill.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <AIResolutionPanel refill={refill} />

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                      <Activity size={20} />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Refill activity
                      </h2>

                      <p className="text-sm text-slate-500">
                        Actions and workflow history for this refill.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {events
                    .slice()
                    .reverse()
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex gap-4 px-6 py-5"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          {event.status === "COMPLETED" ||
                          event.status === "APPROVED" ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <Activity size={18} />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {event.title}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {event.description}
                              </p>
                            </div>

                            <p className="shrink-0 text-xs text-slate-400">
                              {new Date(
                                event.timestamp
                              ).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>

                          <div className="mt-2 flex gap-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                              {event.actor}
                            </span>

                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-600">
                              {event.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Refill details
                </h2>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-xs text-slate-400">
                      Patient
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {refill.patient}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Medication
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {refill.medication}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Quantity
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {refill.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Pharmacy
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {refill.pharmacy}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Provider
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {refill.provider}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Current blocker
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {refill.blocker}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex gap-3">
                  <AlertCircle
                    size={19}
                    className="shrink-0 text-blue-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Human-controlled clinical decisions
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      RxNexus supports workflow coordination.
                      Clinical decisions remain under authorized
                      professional control.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="text-xs text-slate-400">
              Synthetic demo data for the RxNexus challenge MVP.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}