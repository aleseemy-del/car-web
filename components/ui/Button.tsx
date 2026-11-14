"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

type Variant = "accent" | "dark" | "light";
type Status = "idle" | "loading" | "success" | "error";

type Props = {
  children: ReactNode;
  /** لو رجّعت Promise يظهر التحميل ثم نجاح أو خطأ تلقائيًا */
  onClick?: () => void | Promise<void>;
  variant?: Variant;
  icon?: string;
  disabled?: boolean;
  className?: string;
  successLabel?: string;
  errorLabel?: string;
};

const BASE = "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 text-base font-bold transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const STYLE: Record<Variant, string> = {
  accent: "bg-accent text-ink",
  dark: "bg-ink text-white",
  light: "bg-surface text-ink",
};

/** زر بكل حالاته: عادي · قيد التنفيذ · معطّل · نجاح · خطأ */
export function Button({ children, onClick, variant = "accent", icon, disabled, className = "", successLabel = "تم", errorLabel = "صار خطأ، حاول مرة ثانية" }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const busy = status === "loading";
  const off = disabled || busy;

  async function handle() {
    if (off) return;
    try {
      const r = onClick?.();
      if (r instanceof Promise) {
        setStatus("loading");
        await r;
        setStatus("success");
      }
    } catch {
      setStatus("error");
    }
    timer.current = setTimeout(() => setStatus("idle"), 2200);
  }

  const tone =
    status === "success" ? "bg-good text-ink" : status === "error" ? "bg-critical text-white" : STYLE[variant];

  return (
    <button
      type="button"
      onClick={handle}
      disabled={off}
      aria-busy={busy}
      className={`${BASE} ${tone} ${off ? "cursor-not-allowed opacity-50" : ""} ${className}`}
    >
      {status === "loading" && <Icon name="spinner" size={18} className="animate-spin" />}
      {status === "success" && <Icon name="check" size={18} />}
      {status === "error" && <Icon name="close" size={18} />}
      <span>{status === "success" ? successLabel : status === "error" ? errorLabel : busy ? "جاري التنفيذ…" : children}</span>
      {status === "idle" && icon && <Icon name={icon} size={18} className={variant === "dark" ? "text-accent" : ""} />}
    </button>
  );
}
