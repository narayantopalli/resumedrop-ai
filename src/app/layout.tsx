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
  title: "resumedrop.ai - Improve your resume, find your dream internship!",
  description: "Ready to apply for your dream internship? Just upload a copy of your resume and we'll take care of the rest. 😊",
  keywords: ["resume", "resume drop", "ai", "networking", "linkedin", "job search", "job matching", "job finding", "job application", "job application matching", "job application finding", "job application networking", "college", "college networking", "college job search", "college job matching", "college job finding", "college job application", "college job application matching", "college job application finding", "college job application networking", "internship", "internship drop", "internship matching", "internship finding", "internship application", "internship application matching", "internship application finding", "internship application networking"],
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
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 dark:bg-neutral-900`}
      >
        Impact-Site-Verification: f47aee99-2304-46fb-ad89-ea4caf65c4ef
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
