"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  RefreshCw,
  Users,
  UserRound,
  BarChart3,
  Settings,
  Pill,
  ClipboardList,
} from "lucide-react";

import { createClient } from "../../lib/supabase";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["Practice Manager"],
  },
  {
    name: "Refills",
    href: "/refills",
    icon: RefreshCw,
    roles: ["Practice Manager", "Provider", "Pharmacy"],
  },
  {
    name: "Providers",
    href: "/providers",
    icon: UserRound,
    roles: ["Practice Manager", "Provider"],
  },
  {
    name: "Pharmacy",
    href: "/pharmacy",
    icon: Pill,
    roles: ["Practice Manager", "Pharmacy"],
  },
  {
    name: "Patients",
    href: "/patients",
    icon: Users,
    roles: ["Practice Manager", "Provider"],
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["Practice Manager"],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    roles: [
      "Practice Manager",
      "Provider",
      "Pharmacy",
      "Patient",
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState("Practice Manager");

  useEffect(() => {
    const loadRole = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role) {
        setRole(profile.role);
      }
    };

    loadRole();
  }, []);

  const visibleNavigation = navigation.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
          Rx
        </div>

        <div className="ml-3">
          <p className="font-bold text-slate-900">
            RxNexus
          </p>

          <p className="text-xs text-slate-400">
            Refill Operations
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <ClipboardList
              size={16}
              className="text-blue-600"
            />

            <span className="text-xs font-semibold text-slate-700">
              Current Role
            </span>
          </div>

          <p className="mt-2 text-sm font-medium text-slate-900">
            {role}
          </p>
        </div>
      </div>
    </aside>
  );
}