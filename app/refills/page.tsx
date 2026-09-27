"use client";

import {
  Search,
  Filter,
  ArrowRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRefills } from "../context/RefillContext";

export default function RefillsPage() {
  const { refills } = useRefills();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredRefills = refills.filter((refill) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      refill.id.toLowerCase().includes(searchText) ||
      refill.patient.toLowerCase().includes(searchText) ||
      refill.medication.toLowerCase().includes(searchText) ||
      refill.pharmacy.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      refill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const total = refills.length;

  const providerReview = refills.filter(
    (refill) => refill.status === "PROVIDER_REVIEW"
  ).length;

  const blocked = refills.filter(
    (refill) =>
      refill.status === "BLOCKED" ||
      refill.status === "MORE_INFO_REQUIRED" ||
      refill.status === "VISIT_REQUIRED"
  ).length;

  const completed = refills.filter(
    (refill) => refill.status === "COMPLETED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-8">
          <div className="mb-8">
            <p className="text-sm font-medium text-blue-600">
              Refill operations
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Refill requests
            </h1>

            <p className="mt-2 text-slate-500">
              Track every refill from request through resolution.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-5">
            <StatCard
              title="Total Refills"
              value={String(total)}
              icon={RefreshCw}
              description="All active demo requests"
            />

            <StatCard
              title="Provider Review"
              value={String(providerReview)}
              icon={Clock3}
              description="Waiting for provider action"
            />

            <StatCard
              title="Blocked"
              value={String(blocked)}
              icon={AlertCircle}
              description="Require additional action"
            />

            <StatCard
              title="Completed"
              value={String(completed)}
              icon={CheckCircle2}
              description="Successfully completed"
            />
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  All refill requests
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Search and filter the refill workflow.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {filteredRefills.length} requests
              </span>
            </div>

            <div className="border-b border-slate-200 p-5">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search patient, medication, pharmacy or refill ID..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-8 text-sm text-slate-700 outline-none focus:border-blue-400"
                  >
                    <option value="ALL">
                      All statuses
                    </option>

                    <option value="PROVIDER_REVIEW">
                      Provider Review
                    </option>

                    <option value="BLOCKED">
                      Blocked
                    </option>

                    <option value="MORE_INFO_REQUIRED">
                      More Information
                    </option>

                    <option value="VISIT_REQUIRED">
                      Visit Required
                    </option>

                    <option value="APPROVED">
                      Approved
                    </option>

                    <option value="PHARMACY_FULFILLMENT">
                      Pharmacy Fulfillment
                    </option>

                    <option value="PATIENT_NOTIFIED">
                      Patient Notified
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredRefills.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <Search
                    size={40}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-4 font-semibold text-slate-800">
                    No refills found
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Try changing your search or status filter.
                  </p>
                </div>
              ) : (
                filteredRefills.map((refill) => (
                  <div
                    key={refill.id}
                    className="flex items-center justify-between gap-6 px-6 py-5 transition hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-semibold text-slate-600">
                        {refill.patient
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-slate-900">
                            {refill.patient}
                          </p>

                          <span className="text-xs text-slate-400">
                            {refill.id}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {refill.medication} | {refill.quantity}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span className="text-xs text-slate-400">
                            {refill.pharmacy}
                          </span>

                          <span className="text-xs text-slate-300">
                            |
                          </span>

                          <span className="text-xs text-slate-400">
                            {refill.provider}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-6">
                      <div className="text-right">
                        <StatusBadge status={refill.status} />

                        <p className="mt-2 text-xs text-slate-400">
                          {refill.requested}
                        </p>
                      </div>

                      <div className="hidden text-right lg:block">
                        <p className="text-xs text-slate-400">
                          Blocker
                        </p>

                        <p className="mt-1 max-w-48 text-sm font-medium text-slate-700">
                          {refill.blocker}
                        </p>
                      </div>

                      <Link
                        href={`/refills/${refill.id}`}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        View
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="text-xs text-slate-400">
              Synthetic demo data for the RxNexus challenge MVP.
              Refill information shown here is simulated.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const config: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    PROVIDER_REVIEW: {
      label: "Provider Review",
      className: "bg-amber-50 text-amber-700",
    },

    BLOCKED: {
      label: "Blocked",
      className: "bg-red-50 text-red-700",
    },

    MORE_INFO_REQUIRED: {
      label: "More Information",
      className: "bg-orange-50 text-orange-700",
    },

    VISIT_REQUIRED: {
      label: "Visit Required",
      className: "bg-purple-50 text-purple-700",
    },

    APPROVED: {
      label: "Approved",
      className: "bg-blue-50 text-blue-700",
    },

    PHARMACY_FULFILLMENT: {
      label: "Pharmacy Fulfillment",
      className: "bg-indigo-50 text-indigo-700",
    },

    PATIENT_NOTIFIED: {
      label: "Patient Notified",
      className: "bg-cyan-50 text-cyan-700",
    },

    COMPLETED: {
      label: "Completed",
      className: "bg-emerald-50 text-emerald-700",
    },
  };

  const current = config[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof RefreshCw;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}