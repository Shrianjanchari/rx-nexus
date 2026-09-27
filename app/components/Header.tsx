"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Search,
  RotateCcw,
  LogOut,
} from "lucide-react";

import DemoRoleSwitcher from "./DemoRoleSwitcher";
import { useRefills } from "../context/RefillContext";
import { createClient } from "../../lib/supabase";

export default function Header() {
  const { resetDemo } = useRefills();

  const [fullName, setFullName] = useState("Loading...");
  const [role, setRole] = useState("Loading...");

  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setFullName("Guest");
        setRole("Not signed in");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name);
        setRole(profile.role);
      } else {
        setFullName(
          user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User"
        );
        setRole("Practice Manager");
      }
    };

    loadProfile();
  }, []);

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset the RxNexus demo to its original state?"
    );

    if (confirmed) {
      resetDemo();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const initials = fullName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <p className="text-sm text-slate-400">
          Operations
        </p>

        <h2 className="text-xl font-semibold text-slate-900">
          Refill Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search refills..."
            className="w-64 rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-400"
          />
        </div>

        <DemoRoleSwitcher />

        <button
          onClick={handleReset}
          title="Reset demo"
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          <RotateCcw size={15} />

          <span className="hidden xl:inline">
            Reset Demo
          </span>
        </button>

        <button
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <Bell size={20} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {initials}
          </div>

          <div className="hidden xl:block">
            <p className="text-sm font-medium text-slate-800">
              {fullName}
            </p>

            <p className="text-xs text-slate-400">
              {role}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} />

          <span className="hidden xl:inline">
            Logout
          </span>
        </button>
      </div>
    </header>
  );
}