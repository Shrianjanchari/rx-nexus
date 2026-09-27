"use client";

import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Pill,
  Search,
  UserRound,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRefills } from "../context/RefillContext";

export default function Patients() {
  const { refills } = useRefills();

  const [search, setSearch] = useState("");

  const patientMap = new Map<
    string,
    {
      patient: string;
      refills: typeof refills;
    }
  >();

  refills.forEach((refill) => {
    if (!patientMap.has(refill.patient)) {
      patientMap.set(refill.patient, {
        patient: refill.patient,
        refills: [],
      });
    }

    patientMap.get(refill.patient)?.refills.push(refill);
  });

  const patients = Array.from(patientMap.values()).filter(
    (patient) =>
      patient.patient
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const getLatestRefill = (patientRefills: typeof refills) => {
    return patientRefills[patientRefills.length - 1];
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700";

      case "APPROVED":
      case "PHARMACY_FULFILLMENT":
      case "PATIENT_NOTIFIED":
        return "bg-blue-50 text-blue-700";

      case "PROVIDER_REVIEW":
        return "bg-amber-50 text-amber-700";

      case "BLOCKED":
      case "MORE_INFO_REQUIRED":
      case "VISIT_REQUIRED":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      BLOCKED: "Blocked",
      PROVIDER_REVIEW: "Provider Review",
      APPROVED: "Approved",
      MORE_INFO_REQUIRED: "More Info Required",
      VISIT_REQUIRED: "Visit Required",
      PHARMACY_FULFILLMENT: "Pharmacy Fulfillment",
      PATIENT_NOTIFIED: "Patient Notified",
      COMPLETED: "Completed",
    };

    return labels[status] ?? status;
  };

  const totalPatients = patients.length;

  const patientsWithActiveRefills = patients.filter(
    (patient) =>
      patient.refills.some(
        (refill) => refill.status !== "COMPLETED"
      )
  ).length;

  const patientsNeedingAction = patients.filter(
    (patient) =>
      patient.refills.some(
        (refill) =>
          refill.status === "BLOCKED" ||
          refill.status === "PROVIDER_REVIEW"
      )
  ).length;

  const completedPatients = patients.filter(
    (patient) =>
      patient.refills.length > 0 &&
      patient.refills.every(
        (refill) => refill.status === "COMPLETED"
      )
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-8">
          <div className="mb-8">
            <p className="text-sm font-medium text-blue-600">
              Patient operations
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Patients
            </h1>

            <p className="mt-2 text-slate-500">
              View patient refill activity and quickly identify requests
              that need attention.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Patients
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {totalPatients}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Patients with refill activity
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <UserRound size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Active Refills
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {patientsWithActiveRefills}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Patients with ongoing requests
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Activity size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Needs Attention
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {patientsNeedingAction}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Blocked or awaiting provider
                  </p>
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
                    Completed
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {completedPatients}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    No active refill requests
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Patient directory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Patients currently represented in the refill workflow.
                </p>
              </div>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search patients..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  className="w-64 rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {patients.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <Search
                    size={35}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 font-semibold text-slate-800">
                    No patients found
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Try a different patient name.
                  </p>
                </div>
              ) : (
                patients.map((patient) => {
                  const latestRefill = getLatestRefill(
                    patient.refills
                  );

                  if (!latestRefill) return null;

                  const initials = patient.patient
                    .split(" ")
                    .map((name) => name[0])
                    .join("");

                  return (
                    <div
                      key={patient.patient}
                      className="flex items-center justify-between px-6 py-5 transition hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                          {initials}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {patient.patient}
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <Pill
                              size={14}
                              className="text-slate-400"
                            />

                            <p className="text-sm text-slate-500">
                              {latestRefill.medication}
                            </p>
                          </div>

                          <p className="mt-1 text-xs text-slate-400">
                            {latestRefill.provider} ·{" "}
                            {latestRefill.pharmacy}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="hidden text-right md:block">
                          <p className="text-xs text-slate-400">
                            Refill requests
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {patient.refills.length}
                          </p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              latestRefill.status
                            )}`}
                          >
                            {getStatusLabel(latestRefill.status)}
                          </span>

                          <p className="mt-2 text-xs text-slate-400">
                            {latestRefill.id}
                          </p>
                        </div>

                        <Link
                          href={`/patient/${latestRefill.id}`}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                          View
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            RxNexus patient data is synthetic demo data.
          </p>
        </main>
      </div>
    </div>
  );
}