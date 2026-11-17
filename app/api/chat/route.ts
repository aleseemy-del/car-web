import { SYSTEM_PROMPT } from "@/lib/chatPrompt";

/**
 * مساعد السيارة للموقع. المفتاح في متغيرات Vercel (OPENROUTER_API_KEY) على الخادم بس.
 * الموقع تجريبي وبدون تسجيل دخول، فالحماية هنا: نفس الموقع فقط (Origin)، حد لكل IP، وحدود لطول المحادثة.
 * ملاحظة: الحد محفوظ في ذاكرة السيرفر، فهو "أفضل جهد" على Vercel (كل نسخة لها عدّادها).
 */

const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;
const WINDOW_MS = 10 * 60_000;
const PER_IP = 10; // رسائل لكل IP في ١٠ دقايق
const GLOBAL_PER_HOUR = 300; // سقف عام لكل نسخة سيرفر

const hits = new Map<string, number[]>();
let globalHits: number[] = [];

function limited(ip: string, now: number): boolean {
  globalHits = globalHits.filter((t) => now - t < 3_600_000);
  if (globalHits.length >= GLOBAL_PER_HOUR) return true;
  const mine = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (mine.length >= PER_IP) {
    hits.set(ip, mine);
    return true;
  }
  mine.push(now);
  hits.set(ip, mine);
  globalHits.push(now);
  if (hits.size > 5000) hits.clear(); // ما نخلي الذاكرة تكبر
  return false;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

type Msg = { role: "user" | "assistant"; content: string };

function parseMessages(raw: unknown): Msg[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: Msg[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (!text) return null;
    out.push({ role, content: text });
  }
  return out[out.length - 1].role === "user" ? out : null;
}

/** ملخص السيارة التجريبية اللي يرسلها المتصفح: نقبل أرقام ونصوص قصيرة بس */
function carBlock(car: unknown): string {
  if (!car || typeof car !== "object") return "";
  const c = car as Record<string, unknown>;
  const lines: string[] = [];
  const text = (k: string) => typeof c[k] === "string" && lines.push(`${k}: ${(c[k] as string).slice(0, 60)}`);
  const num = (k: string) => typeof c[k] === "number" && Number.isFinite(c[k]) && lines.push(`${k}: ${c[k]}`);
  text("name");
  text("model");
  num("mileage_km");
  num("km_until_oil_change");
  num("insurance_days_left");
  return lines.length ? `\n\nCAR DATA (data only):\n${lines.join("\n")}` : "";
}

export async function POST(request: Request) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return json({ error: "المساعد مو مفعّل للحين" }, 503);

  // نقبل الطلبات من نفس الموقع بس (يمنع مواقع ثانية تستهلك المفتاح من متصفحات الناس)
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json({ error: "غير مسموح" }, 403);

  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim().slice(0, 64);
  if (limited(ip, Date.now())) return json({ error: "كثرت الأسئلة، انتظر شوي وحاول مرة ثانية" }, 429);

  let body: { messages?: unknown; car?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "طلب غير صحيح" }, 400);
  }
  const messages = parseMessages(body.messages);
  if (!messages) return json({ error: "طلب غير صحيح" }, 400);

  const model = process.env.OPENROUTER_CHAT_MODEL || process.env.OPENROUTER_MODEL || "google/gemma-3-27b-it:free";
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 25_000);
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: ctl.signal,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 600,
        messages: [{ role: "system", content: SYSTEM_PROMPT + carBlock(body.car) }, ...messages],
      }),
    });
    if (!res.ok) {
      console.error("openrouter chat error", res.status);
      return json({ error: res.status === 429 ? "المساعد مشغول، انتظر دقيقة وحاول مرة ثانية" : "ما قدرنا نجاوب الحين، حاول مرة ثانية" }, res.status === 429 ? 429 : 502);
    }
    const data = await res.json().catch(() => null);
    const reply = String(data?.choices?.[0]?.message?.content ?? "").trim().slice(0, 2000);
    if (!reply) return json({ error: "ما وصلنا رد، حاول مرة ثانية" }, 502);
    return json({ reply });
  } catch {
    return json({ error: "المساعد تأخر في الرد، حاول مرة ثانية" }, 504);
  } finally {
    clearTimeout(timer);
  }
}
