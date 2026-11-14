import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { TabBar } from "@/components/layout/TabBar";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "حالة السيارة",
  description: "تابع صيانة سيارتك ومصاريفها في مكان واحد",
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="min-h-dvh">
        <AppProvider>
          {/* إطار بعرض الجوال في الشاشات الكبيرة */}
          <div className="relative mx-auto min-h-dvh w-full max-w-md bg-canvas shadow-2xl shadow-black">
            <main className="px-5 pt-5 pb-32">{children}</main>
            <TabBar />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
