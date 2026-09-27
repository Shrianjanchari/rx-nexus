"use client";

import {
  Brain,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ArrowRight,
  UserRound,
  Lightbulb,
} from "lucide-react";

import { Refill } from "../context/RefillContext";

interface AIResolutionPanelProps {
  refill: Refill;
}

export default function AIResolutionPanel({
  refill,
}: AIResolutionPanelProps) {
  const getAIAnalysis = () => {
    if (refill.status === "PROVIDER_REVIEW") {
      return {
        blocker: refill.blocker,
        owner: "Provider",
        action: "Review and approve the prescription renewal",
        reason:
          "No refills remain or provider authorization is required before the pharmacy can continue.",
        priority:
          refill.priority === "High" ? "High priority" : "Needs attention",
      };
    }

    if (refill.status === "BLOCKED") {
      return {
        blocker: refill.blocker,
        owner: "Practice Staff",
        action: "Resolve the missing information or administrative requirement",
        reason:
          "The refill cannot move forward until the blocking information is resolved.",
        priority: "Blocked",
      };
    }

    if (refill.status === "APPROVED") {
      return {
        blocker: "No active blocker",
        owner: "Pharmacy",
        action: "Start pharmacy fulfillment",
        reason:
          "Provider approval is complete. The refill can now move to the pharmacy workflow.",
        priority: "Ready",
      };
    }

    if (refill.status === "PHARMACY_FULFILLMENT") {
      return {
        blocker: "Pharmacy fulfillment in progress",
        owner: "Pharmacy",
        action: "Complete fulfillment and notify the patient",
        reason:
          "The prescription has been approved and is currently being processed by the pharmacy.",
        priority: "In progress",
      };
    }

    if (refill.status === "PATIENT_NOTIFIED") {
      return {
        blocker: "Awaiting completion",
        owner: "Pharmacy",
        action: "Complete the refill workflow",
        reason:
          "The patient has been notified and the final workflow step remains.",
        priority: "Ready to complete",
      };
    }

    if (refill.status === "COMPLETED") {
      return {
        blocker: "No blocker",
        owner: "None",
        action: "No further action required",
        reason:
          "The refill has successfully completed the full workflow.",
        priority: "Resolved",
      };
    }

    return {
      blocker: refill.blocker,
      owner: "Operations",
      action: "Review refill workflow",
      reason:
        "The system identified a refill that requires workflow attention.",
      priority: "Needs attention",
    };
  };

  const analysis = getAIAnalysis();

  const isResolved = refill.status === "COMPLETED";

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm">
      <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Brain size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  AI Resolution
                </h2>

                <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-purple-700">
                  Intelligence
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Understand the blocker, owner and recommended next action.
              </p>
            </div>
          </div>

          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isResolved
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {analysis.priority}
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <CircleAlert
              size={17}
              className="text-amber-500"
            />

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Why is it stuck?
            </p>
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-800">
            {analysis.blocker}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <UserRound
              size={17}
              className="text-blue-500"
            />

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Who needs to act?
            </p>
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-800">
            {analysis.owner}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <ArrowRight
              size={17}
              className="text-purple-500"
            />

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Next action
            </p>
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-800">
            {analysis.action}
          </p>
        </div>
      </div>

      <div className="mx-6 mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Lightbulb
            size={19}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <p className="text-sm font-semibold text-blue-900">
              AI reasoning
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              {analysis.reason}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          {isResolved ? (
            <CheckCircle2
              size={17}
              className="text-emerald-500"
            />
          ) : (
            <Clock3
              size={17}
              className="text-slate-400"
            />
          )}

          <span className="text-xs text-slate-500">
            {isResolved
              ? "Workflow successfully resolved"
              : "Recommendation generated from current workflow state"}
          </span>
        </div>

        <span className="text-xs font-medium text-slate-400">
          Human approval required for clinical decisions
        </span>
      </div>
    </div>
  );
}