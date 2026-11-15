import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { TabBar } from "@/components/layout/TabBar";
import { Sidebar } from "@/components/layout/Sidebar";

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
          {/* جوال: تطبيق بشريط سفلي · شاشة كبيرة: موقع بشريط جانبي */}
          <div className="mx-auto flex min-h-dvh w-full max-w-md bg-canvas lg:max-w-none">
            <Sidebar />
            <main className="min-w-0 flex-1 px-5 pt-5 pb-32 lg:px-10 lg:pt-10 lg:pb-12">
              <div className="mx-auto w-full lg:max-w-6xl">{children}</div>
            </main>
          </div>
          <TabBar />
        </AppProvider>
      </body>
    </html>
  );
}
