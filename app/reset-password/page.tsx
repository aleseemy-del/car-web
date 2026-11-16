"use client";

import { useEffect, useState } from "react";

/**
 * صفحة تغيير كلمة السر لتطبيق حالة السيارة.
 *
 * التطبيق يرسل رابط "نسيت كلمة السر" من Supabase. الرابط يفتح هالصفحة ومعاه توكن مؤقت
 * (#access_token=...&type=recovery). نستخدمه مرة وحدة عشان نحفظ كلمة السر الجديدة.
 *
 * المفتاح هنا هو المفتاح العام (publishable) — آمن في المتصفح، و RLS تحمي البيانات.
 */
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nsdbpmbgjantghhlmqli.supabase.co";
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "sb_publishable_pkgN0qhoRhWx-vGe4Myi2Q_5LOoeFMu";

type Status = "checking" | "ready" | "invalid" | "saving" | "done";

export default function ResetPasswordPage() {
  const [token, setToken] = useState<string>();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string>();

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const t = hash.get("access_token");
    if (t && hash.get("type") === "recovery") {
      setToken(t);
      setStatus("ready");
      // نشيل التوكن من شريط العنوان عشان ما ينحفظ في السجل
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      setStatus("invalid");
    }
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (password.length < 8) return setError("كلمة السر 8 أحرف على الأقل");
    if (password !== confirm) return setError("كلمتين السر مو متطابقة");
    setStatus("saving");
    try {
      const res = await fetch(`${SB_URL}/auth/v1/user`, {
        method: "PUT",
        headers: { apikey: SB_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401 || res.status === 403) {
        setStatus("invalid");
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error_code === "same_password" ? "اختر كلمة سر غير القديمة" : j.error_code === "weak_password" ? "كلمة السر ضعيفة" : "ما قدرنا نحفظ، حاول مرة ثانية");
        setStatus("ready");
        return;
      }
      setStatus("done");
    } catch {
      setError("تأكد من اتصال الإنترنت");
      setStatus("ready");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-accent text-2xl">🚗</div>

        {status === "checking" && <p className="text-muted">جاري التحميل…</p>}

        {status === "invalid" && (
          <>
            <h1 className="text-2xl font-bold text-white">الرابط انتهى</h1>
            <p className="mt-2 leading-7 text-muted">الرابط يشتغل مرة وحدة ولفترة قصيرة. ارجع للتطبيق واضغط &quot;نسيت كلمة السر؟&quot; مرة ثانية.</p>
          </>
        )}

        {status === "done" && (
          <>
            <h1 className="text-2xl font-bold text-white">تم ✅</h1>
            <p className="mt-2 leading-7 text-muted">تغيّرت كلمة السر. ارجع لتطبيق حالة السيارة وسجّل دخول بكلمة السر الجديدة.</p>
          </>
        )}

        {(status === "ready" || status === "saving") && (
          <form onSubmit={save}>
            <h1 className="text-2xl font-bold text-white">كلمة سر جديدة</h1>
            <p className="mt-2 text-sm text-muted">لتطبيق حالة السيارة</p>

            <label className="mt-6 block text-sm text-muted">كلمة السر الجديدة</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-12 w-full rounded-2xl bg-card px-4 text-white outline-none focus:ring-2 focus:ring-accent"
              dir="ltr"
            />
            <label className="mt-4 block text-sm text-muted">اكتبها مرة ثانية</label>
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1.5 h-12 w-full rounded-2xl bg-card px-4 text-white outline-none focus:ring-2 focus:ring-accent"
              dir="ltr"
            />
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={status === "saving"}
              className="mt-6 h-12 w-full rounded-full bg-accent font-bold text-black disabled:opacity-60"
            >
              {status === "saving" ? "جاري الحفظ…" : "احفظ كلمة السر"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
