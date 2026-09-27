"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { createClient } from "../../lib/supabase";

export type RefillStatus =
  | "BLOCKED"
  | "PROVIDER_REVIEW"
  | "APPROVED"
  | "MORE_INFO_REQUIRED"
  | "VISIT_REQUIRED"
  | "PHARMACY_FULFILLMENT"
  | "PATIENT_NOTIFIED"
  | "COMPLETED";

export interface Refill {
  id: string;
  patient: string;
  medication: string;
  quantity: string;
  pharmacy: string;
  provider: string;
  blocker: string;
  priority: "High" | "Medium" | "Low";
  requested: string;
  lastFilled: string;
  refillsRemaining: number;
  status: RefillStatus;
}

export interface RefillEvent {
  id: string;
  refillId: string;
  title: string;
  description: string;
  actor: string;
  role: string;
  status: RefillStatus;
  timestamp: string;
}

const initialRefills: Refill[] = [
  {
    id: "RX-10482",
    patient: "John Doe",
    medication: "Atorvastatin 20mg",
    quantity: "30 tablets",
    pharmacy: "CityCare Pharmacy",
    provider: "Dr. Sharma",
    blocker: "Provider approval required",
    priority: "High",
    requested: "Today, 9:48 AM",
    lastFilled: "September 1, 2026",
    refillsRemaining: 0,
    status: "PROVIDER_REVIEW",
  },
  {
    id: "RX-10479",
    patient: "Jane Smith",
    medication: "Metformin 500mg",
    quantity: "60 tablets",
    pharmacy: "CityCare Pharmacy",
    provider: "Dr. Sharma",
    blocker: "Insurance information required",
    priority: "Medium",
    requested: "Today, 8:42 AM",
    lastFilled: "August 28, 2026",
    refillsRemaining: 2,
    status: "BLOCKED",
  },
  {
    id: "RX-10471",
    patient: "Michael Brown",
    medication: "Lisinopril 10mg",
    quantity: "30 tablets",
    pharmacy: "HealthPlus Pharmacy",
    provider: "Dr. Sharma",
    blocker: "Missing patient information",
    priority: "Medium",
    requested: "Today, 7:58 AM",
    lastFilled: "August 25, 2026",
    refillsRemaining: 0,
    status: "BLOCKED",
  },
  {
    id: "RX-10465",
    patient: "Emily Johnson",
    medication: "Lisinopril 10mg",
    quantity: "30 tablets",
    pharmacy: "CityCare Pharmacy",
    provider: "Dr. Sharma",
    blocker: "Provider authorization required",
    priority: "Medium",
    requested: "Today, 9:32 AM",
    lastFilled: "August 30, 2026",
    refillsRemaining: 0,
    status: "PROVIDER_REVIEW",
  },
  {
    id: "RX-10451",
    patient: "Michael Wilson",
    medication: "Metformin 500mg",
    quantity: "60 tablets",
    pharmacy: "HealthPlus Pharmacy",
    provider: "Dr. Sharma",
    blocker: "No refills remaining",
    priority: "Medium",
    requested: "Today, 8:57 AM",
    lastFilled: "August 27, 2026",
    refillsRemaining: 0,
    status: "PROVIDER_REVIEW",
  },
];

const initialEvents: RefillEvent[] = [
  {
    id: "EV-10482-1",
    refillId: "RX-10482",
    title: "Refill request received",
    description:
      "CityCare Pharmacy submitted a refill request for Atorvastatin 20mg.",
    actor: "CityCare Pharmacy",
    role: "Pharmacy",
    status: "PROVIDER_REVIEW",
    timestamp: "2026-09-27T09:48:00",
  },
  {
    id: "EV-10482-2",
    refillId: "RX-10482",
    title: "Provider review required",
    description:
      "No refills remain. The request was routed to the provider for approval.",
    actor: "RxNexus",
    role: "Workflow",
    status: "PROVIDER_REVIEW",
    timestamp: "2026-09-27T09:49:00",
  },
  {
    id: "EV-10479-1",
    refillId: "RX-10479",
    title: "Refill request received",
    description:
      "CityCare Pharmacy submitted a refill request for Metformin 500mg.",
    actor: "CityCare Pharmacy",
    role: "Pharmacy",
    status: "BLOCKED",
    timestamp: "2026-09-27T08:42:00",
  },
  {
    id: "EV-10471-1",
    refillId: "RX-10471",
    title: "Refill request received",
    description:
      "HealthPlus Pharmacy submitted a refill request for Lisinopril 10mg.",
    actor: "HealthPlus Pharmacy",
    role: "Pharmacy",
    status: "BLOCKED",
    timestamp: "2026-09-27T07:58:00",
  },
  {
    id: "EV-10465-1",
    refillId: "RX-10465",
    title: "Refill request received",
    description:
      "CityCare Pharmacy submitted a refill request for Lisinopril 10mg.",
    actor: "CityCare Pharmacy",
    role: "Pharmacy",
    status: "PROVIDER_REVIEW",
    timestamp: "2026-09-27T09:32:00",
  },
  {
    id: "EV-10451-1",
    refillId: "RX-10451",
    title: "Refill request received",
    description:
      "HealthPlus Pharmacy submitted a refill request for Metformin 500mg.",
    actor: "HealthPlus Pharmacy",
    role: "Pharmacy",
    status: "PROVIDER_REVIEW",
    timestamp: "2026-09-27T08:57:00",
  },
];

interface CreateRefillInput {
  patient: string;
  medication: string;
  quantity: string;
  pharmacy: string;
  provider: string;
  priority: "High" | "Medium" | "Low";
  refillsRemaining: number;
}

interface RefillContextType {
  refills: Refill[];
  events: RefillEvent[];
  updateRefillStatus: (
    id: string,
    status: RefillStatus,
    blocker?: string
  ) => void;
  createRefill: (input: CreateRefillInput) => string;
  getRefill: (id: string) => Refill | undefined;
  getRefillEvents: (id: string) => RefillEvent[];
  resetDemo: () => void;
}

const RefillContext = createContext<RefillContextType | undefined>(
  undefined
);

const supabase = createClient();

function mapSupabaseRefill(item: any): Refill {
  return {
    id: item.id,
    patient: item.patient_name,
    medication: item.medication,
    quantity: item.quantity,
    pharmacy: item.pharmacy,
    provider: item.provider,
    blocker: item.blocker,
    priority: item.priority,
    requested: item.requested,
    lastFilled: item.last_filled,
    refillsRemaining: item.refills_remaining,
    status: item.status,
  };
}

function mapSupabaseEvent(item: any): RefillEvent {
  return {
    id: item.id,
    refillId: item.refill_id,
    title: item.title,
    description: item.description,
    actor: item.actor,
    role: item.role,
    status: item.status,
    timestamp: item.timestamp,
  };
}

export function RefillProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [refills, setRefills] = useState<Refill[]>(initialRefills);
  const [events, setEvents] = useState<RefillEvent[]>(initialEvents);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSupabaseData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("rxnexus-refill-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "refills",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newRefill = mapSupabaseRefill(payload.new);

            setRefills((current) => {
              if (current.some((item) => item.id === newRefill.id)) {
                return current;
              }

              return [newRefill, ...current];
            });
          }

          if (payload.eventType === "UPDATE") {
            const updatedRefill = mapSupabaseRefill(payload.new);

            setRefills((current) =>
              current.map((item) =>
                item.id === updatedRefill.id
                  ? updatedRefill
                  : item
              )
            );
          }

          if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;

            setRefills((current) =>
              current.filter((item) => item.id !== deletedId)
            );
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "refill_events",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newEvent = mapSupabaseEvent(payload.new);

            setEvents((current) => {
              if (current.some((item) => item.id === newEvent.id)) {
                return current;
              }

              return [...current, newEvent];
            });
          }

          if (payload.eventType === "UPDATE") {
            const updatedEvent = mapSupabaseEvent(payload.new);

            setEvents((current) =>
              current.map((item) =>
                item.id === updatedEvent.id
                  ? updatedEvent
                  : item
              )
            );
          }

          if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;

            setEvents((current) =>
              current.filter((item) => item.id !== deletedId)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("RxNexus Realtime:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSupabaseData = async () => {
    try {
      const { data: refillData, error: refillError } =
        await supabase
          .from("refills")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (refillError) {
        console.error(
          "Unable to load refills from Supabase:",
          refillError
        );
        setLoaded(true);
        return;
      }

      const { data: eventData, error: eventError } =
        await supabase
          .from("refill_events")
          .select("*")
          .order("timestamp", {
            ascending: true,
          });

      if (eventError) {
        console.error(
          "Unable to load refill events from Supabase:",
          eventError
        );
      }

      if (!refillData || refillData.length === 0) {
        await seedDemoData();
      } else {
        setRefills(refillData.map(mapSupabaseRefill));

        if (eventData) {
          setEvents(eventData.map(mapSupabaseEvent));
        }
      }
    } catch (error) {
      console.error(
        "Supabase connection error:",
        error
      );
    } finally {
      setLoaded(true);
    }
  };

  const seedDemoData = async () => {
    const refillRows = initialRefills.map((refill) => ({
      id: refill.id,
      patient_name: refill.patient,
      medication: refill.medication,
      quantity: refill.quantity,
      pharmacy: refill.pharmacy,
      provider: refill.provider,
      blocker: refill.blocker,
      priority: refill.priority,
      requested: refill.requested,
      last_filled: refill.lastFilled,
      refills_remaining: refill.refillsRemaining,
      status: refill.status,
    }));

    const eventRows = initialEvents.map((event) => ({
      id: event.id,
      refill_id: event.refillId,
      title: event.title,
      description: event.description,
      actor: event.actor,
      role: event.role,
      status: event.status,
      timestamp: event.timestamp,
    }));

    const { error: refillError } = await supabase
      .from("refills")
      .upsert(refillRows);

    if (refillError) {
      console.error(
        "Unable to seed refills:",
        refillError
      );
      return;
    }

    const { error: eventError } = await supabase
      .from("refill_events")
      .upsert(eventRows);

    if (eventError) {
      console.error(
        "Unable to seed refill events:",
        eventError
      );
      return;
    }

    setRefills(initialRefills);
    setEvents(initialEvents);
  };

  const updateRefillStatus = (
    id: string,
    status: RefillStatus,
    blocker?: string
  ) => {
    const refill = refills.find(
      (item) => item.id === id
    );

    if (!refill) return;

    const updatedBlocker =
      blocker ?? refill.blocker;

    setRefills((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              blocker: updatedBlocker,
            }
          : item
      )
    );

    const eventDetails = getEventDetails(
      status,
      refill
    );

    const newEvent: RefillEvent = {
      id: `EV-${id}-${Date.now()}`,
      refillId: id,
      title: eventDetails.title,
      description: eventDetails.description,
      actor: eventDetails.actor,
      role: eventDetails.role,
      status,
      timestamp: new Date().toISOString(),
    };

    setEvents((current) => [
      ...current,
      newEvent,
    ]);

    saveStatusChange(
      id,
      status,
      updatedBlocker,
      newEvent
    );
  };

  const saveStatusChange = async (
    id: string,
    status: RefillStatus,
    blocker: string,
    event: RefillEvent
  ) => {
    try {
      const { error: refillError } =
        await supabase
          .from("refills")
          .update({
            status,
            blocker,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", id);

      if (refillError) {
        console.error(
          "Unable to update refill in Supabase:",
          refillError
        );
      }

      await saveEvent(event);
    } catch (error) {
      console.error(
        "Unable to save status change:",
        error
      );
    }
  };

  const createRefill = (
    input: CreateRefillInput
  ) => {
    const id = `RX-${Math.floor(
      10500 + Math.random() * 400
    )}`;

    const now = new Date();

    const requested =
      `Today, ${now.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      )}`;

    const newRefill: Refill = {
      id,
      patient: input.patient,
      medication: input.medication,
      quantity: input.quantity,
      pharmacy: input.pharmacy,
      provider: input.provider,
      blocker:
        input.refillsRemaining === 0
          ? "Provider approval required"
          : "No blocker identified",
      priority: input.priority,
      requested,
      lastFilled: "Not yet filled",
      refillsRemaining:
        input.refillsRemaining,
      status:
        input.refillsRemaining === 0
          ? "PROVIDER_REVIEW"
          : "APPROVED",
    };

    const initialEvent: RefillEvent = {
      id: `EV-${id}-1`,
      refillId: id,
      title: "Refill request received",
      description:
        `${input.pharmacy} submitted a refill request for ${input.medication}.`,
      actor: input.pharmacy,
      role: "Pharmacy",
      status: newRefill.status,
      timestamp: now.toISOString(),
    };

    setRefills((current) => [
      newRefill,
      ...current,
    ]);

    setEvents((current) => [
      ...current,
      initialEvent,
    ]);

    saveNewRefill(
      newRefill,
      initialEvent
    );

    if (input.refillsRemaining === 0) {
      const workflowEvent: RefillEvent = {
        id: `EV-${id}-2`,
        refillId: id,
        title: "Provider review required",
        description:
          "No refills remain. RxNexus routed the request to the provider for approval.",
        actor: "RxNexus",
        role: "Workflow",
        status: "PROVIDER_REVIEW",
        timestamp: new Date(
          now.getTime() + 1000
        ).toISOString(),
      };

      setEvents((current) => [
        ...current,
        workflowEvent,
      ]);

      saveEvent(workflowEvent);
    }

    return id;
  };

  const saveNewRefill = async (
    refill: Refill,
    event: RefillEvent
  ) => {
    try {
      const { error: refillError } =
        await supabase
          .from("refills")
          .insert({
            id: refill.id,
            patient_name: refill.patient,
            medication: refill.medication,
            quantity: refill.quantity,
            pharmacy: refill.pharmacy,
            provider: refill.provider,
            blocker: refill.blocker,
            priority: refill.priority,
            requested: refill.requested,
            last_filled: refill.lastFilled,
            refills_remaining:
              refill.refillsRemaining,
            status: refill.status,
          });

      if (refillError) {
        console.error(
          "Unable to create refill in Supabase:",
          refillError
        );
      }

      await saveEvent(event);
    } catch (error) {
      console.error(
        "Unable to save new refill:",
        error
      );
    }
  };

  const saveEvent = async (
    event: RefillEvent
  ) => {
    const { error } = await supabase
      .from("refill_events")
      .insert({
        id: event.id,
        refill_id: event.refillId,
        title: event.title,
        description: event.description,
        actor: event.actor,
        role: event.role,
        status: event.status,
        timestamp: event.timestamp,
      });

    if (error) {
      console.error(
        "Unable to save refill event:",
        error
      );
    }
  };

  const getRefill = (id: string) => {
    return refills.find(
      (refill) => refill.id === id
    );
  };

  const getRefillEvents = (id: string) => {
    return events.filter(
      (event) => event.refillId === id
    );
  };

  const resetDemo = async () => {
    setRefills(initialRefills);
    setEvents(initialEvents);

    try {
      await supabase
        .from("refill_events")
        .delete()
        .neq("id", "");

      await supabase
        .from("refills")
        .delete()
        .neq("id", "");

      await seedDemoData();
    } catch (error) {
      console.error(
        "Unable to reset Supabase demo:",
        error
      );
    }
  };

  return (
    <RefillContext.Provider
      value={{
        refills,
        events,
        updateRefillStatus,
        createRefill,
        getRefill,
        getRefillEvents,
        resetDemo,
      }}
    >
      {children}
    </RefillContext.Provider>
  );
}

function getEventDetails(
  status: RefillStatus,
  refill: Refill
) {
  switch (status) {
    case "APPROVED":
      return {
        title: "Renewal approved",
        description:
          "The provider approved the refill renewal. The request can now move to pharmacy fulfillment.",
        actor: refill.provider,
        role: "Provider",
      };

    case "MORE_INFO_REQUIRED":
      return {
        title: "More information requested",
        description:
          "Additional information is required before the refill can continue.",
        actor: refill.provider,
        role: "Provider",
      };

    case "VISIT_REQUIRED":
      return {
        title: "Visit required",
        description:
          "The provider indicated that a visit is required before the refill can continue.",
        actor: refill.provider,
        role: "Provider",
      };

    case "PHARMACY_FULFILLMENT":
      return {
        title: "Pharmacy fulfillment started",
        description:
          "The pharmacy started processing the approved refill.",
        actor: refill.pharmacy,
        role: "Pharmacy",
      };

    case "PATIENT_NOTIFIED":
      return {
        title: "Patient notified",
        description:
          "The patient was notified that the refill is ready.",
        actor: "RxNexus",
        role: "Patient Communication",
      };

    case "COMPLETED":
      return {
        title: "Refill completed",
        description:
          "The refill workflow has been completed successfully.",
        actor: refill.pharmacy,
        role: "Pharmacy",
      };

    case "BLOCKED":
      return {
        title: "Refill blocked",
        description:
          "The refill requires additional action before it can continue.",
        actor: "RxNexus",
        role: "Workflow",
      };

    case "PROVIDER_REVIEW":
      return {
        title: "Provider review required",
        description:
          "The request was routed to the provider for review.",
        actor: "RxNexus",
        role: "Workflow",
      };

    default:
      return {
        title: "Workflow updated",
        description:
          "The refill workflow status was updated.",
        actor: "RxNexus",
        role: "Workflow",
      };
  }
}

export function useRefills() {
  const context =
    useContext(RefillContext);

  if (!context) {
    throw new Error(
      "useRefills must be used inside RefillProvider"
    );
  }

  return context;
}