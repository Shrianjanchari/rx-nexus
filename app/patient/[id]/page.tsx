"use client";

import {
  CheckCircle2,
  Clock3,
  Pill,
  ArrowLeft,
  Bell,
  Activity,
} from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useRefills } from "../../context/RefillContext";

export default function PatientStatusPage() {
  const params = useParams();
  const refillId = String(params.id);

  const {
    getRefill,
    getRefillEvents,
  } = useRefills();

  const refill = getRefill(refillId);

  if (!refill) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Refill not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            We could not find the requested refill.
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Back to RxNexus
          </Link>
        </div>
      </main>
    );
  }

  const events = getRefillEvents(refill.id);

  const isApproved =
    refill.status === "APPROVED";

  const isFulfillment =
    refill.status === "PHARMACY_FULFILLMENT";

  const isNotified =
    refill.status === "PATIENT_NOTIFIED";

  const isCompleted =
    refill.status === "COMPLETED";

  const isBlocked =
    refill.status === "BLOCKED" ||
    refill.status === "MORE_INFO_REQUIRED" ||
    refill.status === "VISIT_REQUIRED";

  const progress =
    isCompleted
      ? 100
      : isNotified
      ? 80
      : isFulfillment
      ? 60
      : isApproved
      ? 40
      : isBlocked
      ? 20
      : 20;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              Rx
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">
                RxNexus
              </p>

              <p className="text-xs text-slate-400">
                Connect. Resolve. Complete.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Bell size={17} />
            Refill status
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Patient refill status
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Hello, {refill.patient}
          </h1>

          <p className="mt-2 text-slate-500">
            Here is the latest status of your prescription refill.
          </p>
        </div>

        <div
          className={`rounded-2xl border p-6 shadow-sm ${
            isCompleted
              ? "border-emerald-200 bg-emerald-50"
              : isNotified
              ? "border-blue-200 bg-blue-50"
              : isBlocked
              ? "border-amber-200 bg-amber-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isCompleted
                  ? "bg-emerald-100 text-emerald-600"
                  : isNotified
                  ? "bg-blue-100 text-blue-600"
                  : isBlocked
                  ? "bg-amber-100 text-amber-600"
                  : "bg-white text-blue-600"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 size={24} />
              ) : isBlocked ? (
                <Clock3 size={24} />
              ) : (
                <Activity size={24} />
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Current status
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {getPatientStatus(refill.status)}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {getPatientMessage(refill.status)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Refill progress
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                {refill.medication}
              </h2>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {refill.id}
            </span>
          </div>

          <div className="mt-6">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>Request</span>
              <span>Provider</span>
              <span>Pharmacy</span>
              <span>Ready</span>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <TimelineStep
              title="Refill request received"
              description="Your refill request has been received."
              active
              completed={
                isApproved ||
                isFulfillment ||
                isNotified ||
                isCompleted
              }
            />

            <TimelineStep
              title="Provider review"
              description="Your prescription was reviewed by the provider."
              active={
                refill.status !== "BLOCKED" ||
                isBlocked
              }
              completed={
                isApproved ||
                isFulfillment ||
                isNotified ||
                isCompleted
              }
            />

            <TimelineStep
              title="Pharmacy fulfillment"
              description="The pharmacy is processing your refill."
              active={
                isFulfillment ||
                isNotified ||
                isCompleted
              }
              completed={
                isNotified ||
                isCompleted
              }
            />

            <TimelineStep
              title="Patient notified"
              description="You will be informed when the refill is ready."
              active={
                isNotified ||
                isCompleted
              }
              completed={
                isNotified ||
                isCompleted
              }
            />

            <TimelineStep
              title="Completed"
              description="Your refill workflow is complete."
              active={isCompleted}
              completed={isCompleted}
              last
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Pill size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Prescription
                </p>

                <p className="font-semibold text-slate-900">
                  {refill.medication}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <InfoRow
                label="Quantity"
                value={refill.quantity}
              />

              <InfoRow
                label="Pharmacy"
                value={refill.pharmacy}
              />

              <InfoRow
                label="Provider"
                value={refill.provider}
              />

              <InfoRow
                label="Refill requested"
                value={refill.requested}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Activity size={20} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Latest update
                </p>

                <p className="font-semibold text-slate-900">
                  Refill activity
                </p>
              </div>
            </div>

            <div className="mt-6">
              {events.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No activity has been recorded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {events
                    .slice()
                    .reverse()
                    .slice(0, 4)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex gap-3"
                      >
                        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {event.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-400">
                            {event.description}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
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
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-800">
            What happens next?
          </p>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {getNextAction(refill.status)}
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            RxNexus patient status demo | Synthetic data
          </p>
        </div>
      </div>
    </main>
  );
}

function getPatientStatus(status: string) {
  switch (status) {
    case "PROVIDER_REVIEW":
      return "Waiting for provider review";

    case "BLOCKED":
      return "Additional information required";

    case "MORE_INFO_REQUIRED":
      return "More information required";

    case "VISIT_REQUIRED":
      return "Visit required";

    case "APPROVED":
      return "Refill approved";

    case "PHARMACY_FULFILLMENT":
      return "Pharmacy is preparing your refill";

    case "PATIENT_NOTIFIED":
      return "Your refill is ready";

    case "COMPLETED":
      return "Refill completed";

    default:
      return "Processing refill";
  }
}

function getPatientMessage(status: string) {
  switch (status) {
    case "PROVIDER_REVIEW":
      return "Your refill request has reached your provider and is waiting for review.";

    case "BLOCKED":
      return "Your refill is currently waiting for information before it can continue.";

    case "MORE_INFO_REQUIRED":
      return "Your provider needs additional information before the refill can continue.";

    case "VISIT_REQUIRED":
      return "Your provider has indicated that a visit is required before the refill can continue.";

    case "APPROVED":
      return "Your provider has approved the refill. The pharmacy can now begin processing it.";

    case "PHARMACY_FULFILLMENT":
      return "Your pharmacy is currently preparing your refill.";

    case "PATIENT_NOTIFIED":
      return "Your refill has been processed and you have been notified.";

    case "COMPLETED":
      return "Your refill workflow has been completed successfully.";

    default:
      return "Your refill is currently being processed.";
  }
}

function getNextAction(status: string) {
  switch (status) {
    case "PROVIDER_REVIEW":
      return "Your provider needs to review the refill request. No action is required from you right now.";

    case "BLOCKED":
      return "The refill needs additional information before it can continue. Your care team will determine the next step.";

    case "MORE_INFO_REQUIRED":
      return "Your care team needs additional information. Follow the instructions provided by your practice.";

    case "VISIT_REQUIRED":
      return "Please follow up with your care team about scheduling the required visit.";

    case "APPROVED":
      return "The pharmacy can now begin preparing your refill.";

    case "PHARMACY_FULFILLMENT":
      return "The pharmacy is preparing your medication. You will receive an update when it is ready.";

    case "PATIENT_NOTIFIED":
      return "Your refill is ready. Follow the instructions from your pharmacy.";

    case "COMPLETED":
      return "No further action is required for this refill.";

    default:
      return "Your refill is moving through the workflow.";
  }
}

function TimelineStep({
  title,
  description,
  active,
  completed,
  last = false,
}: {
  title: string;
  description: string;
  active: boolean;
  completed: boolean;
  last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="relative">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            completed
              ? "bg-emerald-100 text-emerald-600"
              : active
              ? "bg-blue-100 text-blue-600"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {completed ? (
            <CheckCircle2 size={18} />
          ) : (
            <Clock3 size={17} />
          )}
        </div>

        {!last && (
          <div className="absolute left-1/2 top-9 h-8 w-px -translate-x-1/2 bg-slate-200" />
        )}
      </div>

      <div className="pb-4">
        <p
          className={`text-sm font-semibold ${
            active
              ? "text-slate-900"
              : "text-slate-400"
          }`}
        >
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
      <span className="text-xs text-slate-400">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-slate-700">
        {value}
      </span>
    </div>
  );
}