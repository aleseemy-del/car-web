"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MOCK_DB } from "./mock";
import type { Booking, Car, Db } from "./types";

type Status = "loading" | "ready" | "error";

type Ctx = {
  status: Status;
  error?: string;
  db: Db | null;
  activeCar: Car | null;
  setActiveCar: (id: string) => void;
  reload: () => void;
  addBooking: (b: Omit<Booking, "id">) => Promise<void>;
  cancelBooking: (id: string) => void;
  notifications: boolean;
  setNotifications: (v: boolean) => void;
};

const AppCtx = createContext<Ctx | null>(null);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** يحاكي طلب سيرفر. للتجربة: ?state=loading أو ?state=error أو ?state=empty */
async function fetchDb(demo: string | null): Promise<Db> {
  await wait(900);
  if (demo === "loading") return new Promise<Db>(() => {}); // يبقى يحمّل
  if (demo === "error") throw new Error("ما قدرنا نحمّل بياناتك. تأكد من الاتصال وحاول مرة ثانية.");
  if (demo === "empty") return { user: MOCK_DB.user, cars: [{ ...MOCK_DB.cars[0], oilDueKm: undefined, insuranceExpiry: undefined }], expenses: [], logs: [], bookings: [] };
  return MOCK_DB;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string>();
  const [db, setDb] = useState<Db | null>(null);
  const [activeId, setActiveId] = useState<string>("");
  const [notifications, setNotifications] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const demo = new URLSearchParams(window.location.search).get("state");
    fetchDb(demo)
      .then((d) => {
        if (cancelled) return;
        setDb(d);
        setActiveId((cur) => cur || d.cars[0]?.id || "");
        setStatus("ready");
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setError(e.message);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const reload = useCallback(() => {
    // بعد "حاول مرة ثانية" نشيل ?state=error عشان ينجح
    const url = new URL(window.location.href);
    if (url.searchParams.get("state") === "error") {
      url.searchParams.delete("state");
      window.history.replaceState(null, "", url);
    }
    setStatus("loading");
    setTick((t) => t + 1);
  }, []);

  const addBooking = useCallback(async (b: Omit<Booking, "id">) => {
    await wait(900); // يحاكي إرسال الحجز للسيرفر
    setDb((d) => (d ? { ...d, bookings: [...d.bookings, { ...b, id: `b${Date.now()}` }] } : d));
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setDb((d) => (d ? { ...d, bookings: d.bookings.filter((x) => x.id !== id) } : d));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      status,
      error,
      db,
      activeCar: db?.cars.find((c) => c.id === activeId) ?? db?.cars[0] ?? null,
      setActiveCar: setActiveId,
      reload,
      addBooking,
      cancelBooking,
      notifications,
      setNotifications,
    }),
    [status, error, db, activeId, reload, addBooking, cancelBooking, notifications],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}
