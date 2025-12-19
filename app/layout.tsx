// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";

export const metadata = {
  title: "InsightEdge AI – Production-Grade AI & Edge Vision",
  description:
    "InsightEdge AI helps businesses automate high-value workflows using Computer Vision, Edge AI, and LLM-powered Intelligent Agents.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-950">
      <body className="min-h-full bg-slate-950 text-slate-50 antialiased">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 md:px-6 md:py-6">
          {/* Navbar */}
          <header className="flex items-center justify-between border-b border-slate-800 pb-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0A1F3D] to-[#00D4FF]" />
              <span className="text-sm font-semibold tracking-wide">
                InsightEdge AI
              </span>
            </Link>
            <nav className="flex gap-4 text-xs md:text-sm text-slate-300">
              <Link href="/services" className="hover:text-cyan-300">
                Services
              </Link>
              <Link href="/portfolio" className="hover:text-cyan-300">
                Portfolio
              </Link>
              <Link href="/about" className="hover:text-cyan-300">
                About
              </Link>
              <Link href="/contact" className="hover:text-cyan-300">
                Contact
              </Link>
            </nav>
          </header>

          <main className="flex-1 py-6 md:py-10">{children}</main>

          <footer className="border-t border-slate-800 pt-3 text-xs text-slate-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <span>© {new Date().getFullYear()} InsightEdge AI – v0.0.4</span>
              <span>Production-grade AI, Edge Vision & Intelligent Agents.</span>
            </div>
          </footer>
        </div>
        <ChatWidget />
      </body>
    </html>
  );
}

