"use client";

import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  UserRound,
  AlertCircle,
} from "lucide-react";

import { useState } from "react";
import Link from "next/link";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRefills } from "../context/RefillContext";

export default function ProvidersPage() {
  const {
    refills,
    updateRefillStatus,
  } = useRefills();

  const providerRefills = refills.filter(
    (refill) =>
      refill.status === "PROVIDER_REVIEW"
  );

  const [selectedId, setSelectedId] =
    useState(
      providerRefills[0]?.id ?? ""
    );

  const selectedRefill =
    refills.find(
      (refill) => refill.id === selectedId
    ) ??
    providerRefills[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleApprove = () => {
    if (!selectedRefill) return;

    updateRefillStatus(
      selectedRefill.id,
      "APPROVED",
      "Renewal approved by provider"
    );
  };

  const handleMoreInfo = () => {
    if (!selectedRefill) return;

    updateRefillStatus(
      selectedRefill.id,
      "MORE_INFO_REQUIRED",
      "Additional patient information required"
    );
  };

  const handleVisitRequired = () => {
    if (!selectedRefill) return;

    updateRefillStatus(
      selectedRefill.id,
      "VISIT_REQUIRED",
      "Provider visit required before renewal"
    );
  };

  const approvedCount = refills.filter(
    (refill) =>
      refill.status === "APPROVED"
  ).length;

  const reviewCount = refills.filter(
    (refill) =>
      refill.status === "PROVIDER_REVIEW"
  ).length;

  const blockedCount = refills.filter(
    (refill) =>
      refill.status === "MORE_INFO_REQUIRED" ||
      refill.status === "VISIT_REQUIRED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-8">
          <div className="mb-8">
            <p className="text-sm font-medium text-blue-600">
              Provider workspace
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Clinical refill review
            </h1>

            <p className="mt-2 text-slate-500">
              Review refill requests and decide the next workflow action.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <StatCard
              title="Awaiting Review"
              value={String(reviewCount)}
              description="Refills requiring provider action"
              icon={Clock3}
            />

            <StatCard
              title="Approved"
              value={String(approvedCount)}
              description="Ready for pharmacy fulfillment"
              icon={CheckCircle2}
            />

            <StatCard
              title="Needs Follow-up"
              value={String(blockedCount)}
              description="More information or visit required"
              icon={AlertCircle}
            />
          </div>

          <div className="mt-8 grid grid-cols-12 gap-6">
            <section className="col-span-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-5">
                <h2 className="font-semibold text-slate-900">
                  Review queue
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Select a refill to review.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {providerRefills.length === 0 ? (
                  <div className="px-5 py-12 text-center">
                    <CheckCircle2
                      size={36}
                      className="mx-auto text-emerald-500"
                    />

                    <p className="mt-3 font-semibold text-slate-800">
                      No refills awaiting review
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      New pharmacy requests will appear here.
                    </p>
                  </div>
                ) : (
                  providerRefills.map((refill) => (
                    <button
                      key={refill.id}
                      onClick={() =>
                        handleSelect(refill.id)
                      }
                      className={`w-full px-5 py-4 text-left transition ${
                        selectedRefill?.id === refill.id
                          ? "bg-blue-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {refill.patient}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {refill.medication}
                          </p>

                          <p className="mt-2 text-xs text-slate-400">
                            {refill.id}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                            refill.priority === "High"
                              ? "bg-red-50 text-red-600"
                              : refill.priority === "Medium"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {refill.priority}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <AlertCircle size={13} />
                        {refill.blocker}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>

            <section className="col-span-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
              {!selectedRefill ? (
                <div className="flex min-h-96 items-center justify-center px-8 text-center">
                  <div>
                    <ClipboardCheck
                      size={44}
                      className="mx-auto text-slate-300"
                    />

                    <h2 className="mt-4 text-lg font-semibold text-slate-800">
                      No refill selected
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Select a request from the provider queue.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-b border-slate-200 px-6 py-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Refill request
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                          {selectedRefill.patient}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {selectedRefill.medication}
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                        Provider Review
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard
                        icon={<UserRound size={18} />}
                        label="Patient"
                        value={selectedRefill.patient}
                      />

                      <InfoCard
                        icon={<FileText size={18} />}
                        label="Medication"
                        value={selectedRefill.medication}
                      />

                      <InfoCard
                        icon={<ClipboardCheck size={18} />}
                        label="Quantity"
                        value={selectedRefill.quantity}
                      />

                      <InfoCard
                        icon={<Clock3 size={18} />}
                        label="Last filled"
                        value={selectedRefill.lastFilled}
                      />
                    </div>

                    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          size={20}
                          className="mt-0.5 text-amber-600"
                        />

                        <div>
                          <p className="font-semibold text-amber-900">
                            Why is this refill stuck?
                          </p>

                          <p className="mt-1 text-sm leading-6 text-amber-800">
                            {selectedRefill.blocker}
                          </p>

                          <p className="mt-2 text-xs text-amber-700">
                            Requested by {selectedRefill.pharmacy}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Provider decision
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Select the next action for this refill.
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <button
                          onClick={handleApprove}
                          className="rounded-xl bg-emerald-600 px-4 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          <CheckCircle2
                            size={19}
                            className="mx-auto mb-2"
                          />

                          Approve Renewal
                        </button>

                        <button
                          onClick={handleMoreInfo}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                        >
                          <FileText
                            size={19}
                            className="mx-auto mb-2 text-blue-600"
                          />

                          Request More Info
                        </button>

                        <button
                          onClick={handleVisitRequired}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-purple-300 hover:bg-purple-50"
                        >
                          <Clock3
                            size={19}
                            className="mx-auto mb-2 text-purple-600"
                          />

                          Require Visit
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <ClipboardCheck size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Human-controlled clinical decision
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            RxNexus provides workflow information and
                            recommendations. The authorized provider
                            remains responsible for the clinical decision.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                      <p className="text-xs text-slate-400">
                        Refill ID: {selectedRefill.id}
                      </p>

                      <Link
                        href={`/refills/${selectedRefill.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        View complete refill
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="text-xs text-slate-400">
              Synthetic demo data for the RxNexus challenge MVP.
              Provider actions simulate workflow decisions.
            </p>
          </div>
        </main>
      </div>
    </div>
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
  icon: typeof Clock3;
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

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}