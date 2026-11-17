import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// عنوان Supabase الوحيد اللي الصفحات تتصل فيه (صفحة تغيير كلمة السر)
const SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nsdbpmbgjantghhlmqli.supabase.co";

// سياسة المحتوى: ما نسمح إلا بمصادرنا. 'unsafe-inline' لأن Next.js يحط سكربتات وستايلات صغيرة داخل الصفحة.
// في التطوير نخفّفها شوي (hot reload يحتاج eval و websocket).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${SUPABASE}${isProd ? "" : " ws: wss:"}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // صفحة تغيير كلمة السر: ما نرسل مصدر الصفحة لأي موقع، وما ينحفظ منها شي في الكاش
      {
        source: "/reset-password",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
