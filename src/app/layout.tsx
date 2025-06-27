import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/contexts/SessionContext";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "resumedrop.ai - The ultimate tool for college networking!",
  description: "Ready to upgrade your network? Just upload a copy of your resume and we'll take care of the rest. 😊",
  keywords: ["resume", "resume drop", "ai", "networking", "linkedin", "job search", "job matching", "job finding", "job application", "job application matching", "job application finding", "job application networking", "college", "college networking", "college job search", "college job matching", "college job finding", "college job application", "college job application matching", "college job application finding", "college job application networking"],
  authors: [{ name: "Narayan V. Topalli" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 dark:bg-neutral-900`}
      >
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
