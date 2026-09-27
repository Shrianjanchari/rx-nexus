import type { ReactNode } from "react";
import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Brain,
  Building2,
  Clock3,
  Pill,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              Rx
            </div>

            <div>
              <p className="text-lg font-bold">RxNexus</p>
              <p className="text-xs text-slate-400">
                Connect. Resolve. Complete.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#solution"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Solution
            </a>

            <a
              href="#workflow"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Workflow
            </a>

            <a
              href="#intelligence"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Intelligence
            </a>

            <a
              href="#customers"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Customers
            </a>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Open Demo
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <section className="overflow-hidden bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Intelligent refill resolution
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-slate-900 lg:text-6xl">
              Prescription refills should not get stuck in the middle.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              RxNexus connects practices, pharmacies and patients around
              one question: why is this refill stuck, who needs to act,
              and what happens next?
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Explore the workflow
                <ArrowRight size={18} />
              </Link>

              <a
                href="#solution"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600"
              >
                See how it works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-500" />
                Workflow visibility
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-500" />
                AI-assisted routing
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-500" />
                Human-controlled decisions
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Live workflow
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  RX-10482
                </h2>
              </div>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Provider Review
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <WorkflowPreview
                number="01"
                title="Refill request received"
                description="CityCare Pharmacy submitted a request."
                completed
              />

              <WorkflowPreview
                number="02"
                title="Blocker identified"
                description="No refills remain on the prescription."
                completed
              />

              <WorkflowPreview
                number="03"
                title="Provider action required"
                description="Dr. Sharma needs to review the renewal."
                active
              />

              <WorkflowPreview
                number="04"
                title="Pharmacy fulfillment"
                description="Begins after provider approval."
              />

              <WorkflowPreview
                number="05"
                title="Patient notified"
                description="Patient receives refill status."
              />
            </div>

            <div className="mt-6 rounded-xl bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Brain size={20} className="mt-0.5 text-blue-600" />

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    AI resolution recommendation
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    Route to provider review because no refills remain.
                    Clinical approval stays with the provider.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solution" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-blue-600">
              The problem
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              Refill work breaks across multiple organizations.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              A pharmacy sends a request. A practice receives it. Someone
              has to determine why it cannot move forward, find the right
              person, resolve the issue and keep the patient informed.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Clock3 size={22} />}
              title="Unclear blockers"
              description="Staff spend time figuring out why a refill is stuck instead of resolving it."
            />

            <FeatureCard
              icon={<Users size={22} />}
              title="Ownership gaps"
              description="Requests can move between pharmacy, practice and provider without clear ownership."
            />

            <FeatureCard
              icon={<Pill size={22} />}
              title="Patient uncertainty"
              description="Patients often do not know whether they need to wait, respond or contact their practice."
            />
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-600">
              One connected workflow
            </p>

            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              From refill request to completion.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
              RxNexus makes the state of every refill visible and gives
              each participant a clear next action.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-5">
            <StepCard
              number="01"
              title="Request"
              description="Pharmacy submits refill request."
            />

            <StepCard
              number="02"
              title="Identify"
              description="System identifies the blocker."
            />

            <StepCard
              number="03"
              title="Route"
              description="Request reaches the correct owner."
            />

            <StepCard
              number="04"
              title="Resolve"
              description="Human action resolves the blocker."
            />

            <StepCard
              number="05"
              title="Complete"
              description="Pharmacy fulfills and patient is informed."
            />
          </div>
        </div>
      </section>

      <section id="intelligence" className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Intelligence layer
            </p>

            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              AI that coordinates the workflow.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              RxNexus uses AI-assisted reasoning to turn refill
              information into a clear workflow recommendation.
            </p>

            <div className="mt-8 space-y-4">
              <IntelligenceItem text="Classify the refill blocker" />
              <IntelligenceItem text="Summarize missing information" />
              <IntelligenceItem text="Identify the responsible owner" />
              <IntelligenceItem text="Recommend the next workflow action" />
              <IntelligenceItem text="Draft patient and staff communication" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Brain size={22} />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    AI Resolution
                  </p>

                  <p className="text-xs text-slate-400">
                    Workflow recommendation
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs text-slate-400">
                    BLOCKER
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    Provider approval required
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    OWNER
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    Dr. Sharma
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    NEXT ACTION
                  </p>

                  <p className="mt-1 font-semibold text-blue-600">
                    Review and approve renewal
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-xs font-semibold text-amber-800">
                    Human approval required
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    AI supports coordination. Clinical decisions remain
                    under authorized professional control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="customers" className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-blue-400">
              Built for the refill ecosystem
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              One workflow. Multiple participants.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Each participant sees the information and actions relevant
              to their role while the refill maintains one connected
              workflow.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <RoleCard
              icon={<Building2 size={24} />}
              title="Practice"
              description="Manage refill queues, provider actions and operational workload."
            />

            <RoleCard
              icon={<Pill size={24} />}
              title="Pharmacy"
              description="Submit requests, track approvals and complete fulfillment."
            />

            <RoleCard
              icon={<Users size={24} />}
              title="Patient"
              description="See refill progress and understand what happens next."
            />
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-white">
              See the complete RxNexus workflow.
            </h2>

            <p className="mt-3 text-blue-100">
              Explore the practice dashboard, provider workspace,
              pharmacy workflow and patient status experience.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
          >
            Launch demo
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-6 py-8 text-sm text-slate-400 md:flex-row">
          <p>RxNexus | Connect. Resolve. Complete.</p>

          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            Synthetic demo platform | 24-hour challenge MVP
          </div>
        </div>
      </footer>
    </main>
  );
}

function WorkflowPreview({
  number,
  title,
  description,
  completed = false,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  completed?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          completed
            ? "bg-emerald-100 text-emerald-700"
            : active
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {completed ? <CheckCircle2 size={17} /> : number}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="text-xs font-bold text-blue-600">
        {number}
      </span>

      <h3 className="mt-4 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function IntelligenceItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2
        size={19}
        className="shrink-0 text-emerald-500"
      />

      <p className="text-sm font-medium text-slate-700">
        {text}
      </p>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}