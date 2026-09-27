"use client";

import type { ReactNode } from "react";

import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  Pill,
  UserRound,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRefills } from "../context/RefillContext";

export default function PharmacyPage() {
  const {
    refills,
    updateRefillStatus,
    createRefill,
  } = useRefills();

  const [showForm, setShowForm] =
    useState(false);

  const [patient, setPatient] =
    useState("");

  const [medication, setMedication] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [priority, setPriority] =
    useState<"High" | "Medium" | "Low">(
      "Medium"
    );

  const [refillsRemaining, setRefillsRemaining] =
    useState("0");

  const pharmacyRefills = refills.filter(
    (refill) =>
      refill.status === "APPROVED" ||
      refill.status === "PHARMACY_FULFILLMENT" ||
      refill.status === "PATIENT_NOTIFIED" ||
      refill.status === "COMPLETED"
  );

  const approvedCount = refills.filter(
    (refill) => refill.status === "APPROVED"
  ).length;

  const fulfillmentCount = refills.filter(
    (refill) =>
      refill.status === "PHARMACY_FULFILLMENT"
  ).length;

  const notifiedCount = refills.filter(
    (refill) =>
      refill.status === "PATIENT_NOTIFIED"
  ).length;

  const completedCount = refills.filter(
    (refill) => refill.status === "COMPLETED"
  ).length;

  const handleCreateRequest = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !patient.trim() ||
      !medication.trim() ||
      !quantity.trim()
    ) {
      return;
    }

    createRefill({
      patient: patient.trim(),
      medication: medication.trim(),
      quantity: quantity.trim(),
      pharmacy: "CityCare Pharmacy",
      provider: "Dr. Sharma",
      priority,
      refillsRemaining:
        Number(refillsRemaining) || 0,
    });

    setPatient("");
    setMedication("");
    setQuantity("");
    setPriority("Medium");
    setRefillsRemaining("0");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-8">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Pharmacy operations
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Fulfillment workspace
              </h1>

              <p className="mt-2 text-slate-500">
                Process approved refills and keep patients informed.
              </p>
            </div>

            <button
              onClick={() =>
                setShowForm(!showForm)
              }
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {showForm ? (
                <X size={17} />
              ) : (
                <Plus size={17} />
              )}

              {showForm
                ? "Close"
                : "New Refill Request"}
            </button>
          </div>

          {showForm && (
            <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Create refill request
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Simulate a pharmacy sending a new refill request
                  into the RxNexus workflow.
                </p>
              </div>

              <form
                onSubmit={handleCreateRequest}
                className="grid grid-cols-2 gap-5"
              >
                <FormField
                  label="Patient name"
                  value={patient}
                  onChange={setPatient}
                  placeholder="Example: Alex Johnson"
                />

                <FormField
                  label="Medication"
                  value={medication}
                  onChange={setMedication}
                  placeholder="Example: Atorvastatin 20mg"
                />

                <FormField
                  label="Quantity"
                  value={quantity}
                  onChange={setQuantity}
                  placeholder="Example: 30 tablets"
                />

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Priority
                  </label>

                  <select
                    value={priority}
                    onChange={(event) =>
                      setPriority(
                        event.target.value as
                          | "High"
                          | "Medium"
                          | "Low"
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                  >
                    <option value="High">
                      High
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Low">
                      Low
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Refills remaining
                  </label>

                  <select
                    value={refillsRemaining}
                    onChange={(event) =>
                      setRefillsRemaining(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                  >
                    <option value="0">
                      0 - Provider approval needed
                    </option>

                    <option value="1">
                      1
                    </option>

                    <option value="2">
                      2
                    </option>

                    <option value="3">
                      3
                    </option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Submit Refill Request
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-4 gap-5">
            <Stat
              title="Ready for Fulfillment"
              value={String(approvedCount)}
              icon={Pill}
            />

            <Stat
              title="In Fulfillment"
              value={String(fulfillmentCount)}
              icon={Clock3}
            />

            <Stat
              title="Patient Notified"
              value={String(notifiedCount)}
              icon={UserRound}
            />

            <Stat
              title="Completed"
              value={String(completedCount)}
              icon={CheckCircle2}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Pharmacy queue
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Approved refills moving through pharmacy fulfillment.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {pharmacyRefills.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <PackageCheck
                    size={42}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-4 font-semibold text-slate-800">
                    No pharmacy refills in the queue
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Approved refills will appear here.
                  </p>
                </div>
              ) : (
                pharmacyRefills.map((refill) => (
                  <div
                    key={refill.id}
                    className="px-6 py-6"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                          <Pill size={21} />
                        </div>

                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-slate-900">
                              {refill.patient}
                            </p>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                refill.status === "APPROVED"
                                  ? "bg-blue-50 text-blue-700"
                                  : refill.status ===
                                      "PHARMACY_FULFILLMENT"
                                  ? "bg-purple-50 text-purple-700"
                                  : refill.status ===
                                      "PATIENT_NOTIFIED"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {getStatusLabel(
                                refill.status
                              )}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {refill.medication}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {refill.quantity} |{" "}
                            {refill.pharmacy}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {refill.status ===
                          "APPROVED" && (
                          <button
                            onClick={() =>
                              updateRefillStatus(
                                refill.id,
                                "PHARMACY_FULFILLMENT"
                              )
                            }
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Start Fulfillment
                            <ArrowRight size={16} />
                          </button>
                        )}

                        {refill.status ===
                          "PHARMACY_FULFILLMENT" && (
                          <button
                            onClick={() =>
                              updateRefillStatus(
                                refill.id,
                                "PATIENT_NOTIFIED"
                              )
                            }
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Notify Patient
                            <UserRound size={16} />
                          </button>
                        )}

                        {refill.status ===
                          "PATIENT_NOTIFIED" && (
                          <button
                            onClick={() =>
                              updateRefillStatus(
                                refill.id,
                                "COMPLETED"
                              )
                            }
                            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            Complete Refill
                            <CheckCircle2 size={16} />
                          </button>
                        )}

                        {refill.status ===
                          "COMPLETED" && (
                          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
                            <CheckCircle2 size={17} />
                            Completed
                          </div>
                        )}

                        <Link
                          href={`/refills/${refill.id}`}
                          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                          View
                        </Link>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-4 gap-3">
                      <ProgressStep
                        label="Approved"
                        active={
                          refill.status ===
                            "APPROVED" ||
                          refill.status ===
                            "PHARMACY_FULFILLMENT" ||
                          refill.status ===
                            "PATIENT_NOTIFIED" ||
                          refill.status ===
                            "COMPLETED"
                        }
                      />

                      <ProgressStep
                        label="Fulfillment"
                        active={
                          refill.status ===
                            "PHARMACY_FULFILLMENT" ||
                          refill.status ===
                            "PATIENT_NOTIFIED" ||
                          refill.status ===
                            "COMPLETED"
                        }
                      />

                      <ProgressStep
                        label="Patient notified"
                        active={
                          refill.status ===
                            "PATIENT_NOTIFIED" ||
                          refill.status ===
                            "COMPLETED"
                        }
                      />

                      <ProgressStep
                        label="Completed"
                        active={
                          refill.status ===
                          "COMPLETED"
                        }
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white p-3 text-blue-600">
                <PackageCheck size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-blue-900">
                  Connected fulfillment workflow
                </h3>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-blue-700">
                  Pharmacy requests enter the shared RxNexus workflow.
                  The system identifies the next owner and keeps the
                  request synchronized across practice, pharmacy and
                  patient views.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="text-xs text-slate-400">
              Synthetic demo data for the RxNexus challenge MVP.
              Pharmacy actions represent a simulated workflow.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function getStatusLabel(status: string) {
  switch (status) {
    case "APPROVED":
      return "Approved";

    case "PHARMACY_FULFILLMENT":
      return "In Fulfillment";

    case "PATIENT_NOTIFIED":
      return "Patient Notified";

    case "COMPLETED":
      return "Completed";

    default:
      return status;
  }
}

function Stat({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: typeof Pill;
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
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function ProgressStep({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-center text-xs font-medium ${
        active
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-slate-50 text-slate-400"
      }`}
    >
      {active && (
        <CheckCircle2
          size={13}
          className="mr-1 inline"
        />
      )}

      {label}
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:bg-white"
      />
    </div>
  );
}