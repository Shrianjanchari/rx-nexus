"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "../../lib/supabase";

const roles = [
  {
    name: "Practice Manager",
    path: "/dashboard",
  },
  {
    name: "Provider",
    path: "/providers",
  },
  {
    name: "Pharmacy",
    path: "/pharmacy",
  },
  {
    name: "Patient",
    path: "/patient/RX-10482",
  },
];

export default function DemoRoleSwitcher() {
  const router = useRouter();

  const [currentRole, setCurrentRole] =
    useState("Practice Manager");

  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadRole = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role) {
        setCurrentRole(profile.role);
      }
    };

    loadRole();
  }, []);

  const handleRoleChange = async (role: {
    name: string;
    path: string;
  }) => {
    if (role.name === currentRole) {
      setOpen(false);
      router.push(role.path);
      return;
    }

    setUpdating(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUpdating(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        role: role.name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Role update failed:", error);
      alert("Unable to update your role.");
      setUpdating(false);
      return;
    }

    setCurrentRole(role.name);
    setOpen(false);
    setUpdating(false);

    router.push(role.path);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={updating}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>
          {updating ? "Updating..." : currentRole}
        </span>

        <ChevronDown
          size={15}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !updating && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Workspaces
          </p>

          {roles.map((role) => (
            <button
              key={role.name}
              onClick={() => handleRoleChange(role)}
              className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                currentRole === role.name
                  ? "bg-blue-50 font-semibold text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}