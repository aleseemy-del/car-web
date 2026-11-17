"use client";

import { useEffect, useRef, useState } from "react";
import { DataGate } from "@/components/ui/DataGate";
import { ListSkeleton } from "@/components/skeletons/Skeletons";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Icon } from "@/components/ui/Icon";
import { daysUntil } from "@/lib/format";
import type { Car } from "@/lib/types";

type Msg = { id: number; role: "user" | "assistant"; content: string };

const SUGGESTIONS = ["السيارة تهتز لما أفرمل", "لمبة الزيت اشتغلت", "المكيف ما يبرد زين", "صوت غريب من المحرك", "السيارة ما تشتغل الصبح"];
const MAX_CHARS = 1000;

/** ملخص بسيط للسيارة التجريبية (أرقام ونصوص قصيرة بس) */
const carSummary = (car: Car) => ({
  name: car.name,
  model: car.model,
  mileage_km: car.mileageKm,
  ...(car.oilDueKm != null ? { km_until_oil_change: car.oilDueKm - car.mileageKm } : {}),
  ...(car.insuranceExpiry ? { insurance_days_left: daysUntil(car.insuranceExpiry) } : {}),
});

function Chat({ car }: { car: Car }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, error]);

  async function ask(history: Msg[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })), car: carSummary(car) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "صار خطأ، حاول مرة ثانية");
      setMessages((m) => [...m, { id: ++idRef.current, role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "تأكد من اتصال الإنترنت وحاول مرة ثانية");
    } finally {
      setLoading(false);
    }
  }

  function send(text: string) {
    const content = text.trim().slice(0, MAX_CHARS);
    if (!content || loading) return;
    const next = [...messages, { id: ++idRef.current, role: "user" as const, content }];
    setMessages(next);
    setInput("");
    void ask(next);
  }

  const canSend = input.trim().length > 0 && !loading;

  return (
    <div className="flex min-h-[calc(100dvh-9rem)] flex-col lg:min-h-[calc(100dvh-8rem)]">
      <ScreenHeader title="مساعد السيارة" subtitle={car.name} />

      <div className="mt-5 flex-1 space-y-3" role="log" aria-live="polite" aria-label="المحادثة">
        {messages.length === 0 && (
          <>
            <div className="rounded-card bg-card p-4">
              <p className="text-base font-bold text-white">وصف المشكلة</p>
              <p className="mt-1 text-sm leading-6 text-muted">اكتب اللي يصير في سيارتك (صوت، ريحة، لمبة، اهتزاز) ومتى يصير، والمساعد يرتّب لك الأسباب المحتملة ويعطيك الحل.</p>
            </div>
            <p className="pt-2 text-sm text-muted">جرّب سؤال من هذي:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} className="rounded-full bg-card px-4 py-2.5 text-sm text-white transition hover:bg-card-2 focus-visible:outline-2 focus-visible:outline-accent">
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[88%] whitespace-pre-wrap rounded-card px-4 py-3 text-base leading-7 ${m.role === "user" ? "bg-accent text-ink" : "bg-card text-white"}`}>{m.content}</div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-end" aria-busy>
            <div className="flex items-center gap-2 rounded-card bg-card px-4 py-3 text-sm text-muted">
              <Icon name="spinner" size={16} className="animate-spin text-accent" />
              يكتب…
            </div>
          </div>
        )}

        {error && (
          <div role="alert" className="rounded-card bg-critical/15 p-4">
            <p className="text-sm text-white">{error}</p>
            <button type="button" onClick={() => void ask(messages)} className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <Icon name="retry" size={16} />
              حاول مرة ثانية
            </button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        className="sticky bottom-24 mt-4 lg:bottom-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <div className="flex items-end gap-2 rounded-[28px] bg-canvas/95 p-1 backdrop-blur">
          <label htmlFor="chat-input" className="sr-only">وصف المشكلة</label>
          <textarea
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            maxLength={MAX_CHARS}
            disabled={loading}
            placeholder="اكتب مشكلة سيارتك…"
            className="max-h-32 min-h-12 flex-1 resize-none rounded-3xl bg-card px-4 py-3 text-base text-white outline-none placeholder:text-muted focus:ring-2 focus:ring-accent disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label="أرسل"
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${canSend ? "bg-accent text-ink active:scale-95" : "cursor-not-allowed bg-card-2 text-zinc-600"}`}
          >
            <Icon name="send" size={20} />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted">المساعد يعطي تقدير مو تشخيص نهائي — الورشة تأكد المشكلة.</p>
      </form>
    </div>
  );
}

export default function ChatPage() {
  return <DataGate skeleton={<ListSkeleton />}>{({ car }) => <Chat car={car} />}</DataGate>;
}
