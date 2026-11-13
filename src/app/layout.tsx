import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mapa de Greves no Brasil",
  description: "Acompanhe greves e paralisações no Brasil por mês e categoria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" style={{ height: '100%' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <header style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
          <nav
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '10px 24px 0',
            }}
          >
            <Link href="/mapa" style={{ color: '#4b5563', textDecoration: 'none', fontSize: 14 }}>
              Mapa
            </Link>
            <Link href="/sobre" style={{ color: '#4b5563', textDecoration: 'none', fontSize: 14 }}>
              Sobre
            </Link>
          </nav>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 8,
            }}
          >
            <Link
              href="/mapa"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                textDecoration: 'none',
                color: '#111827',
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: '-1px',
                lineHeight: 1,
              }}
            >
              <span>Mapa de</span>
              <img
                src="/brasil.png"
                alt=""
                style={{ height: 56, width: 'auto', display: 'block' }}
              />
              <span>Greves</span>
            </Link>
          </div>
        </header>
        <div style={{ flex: 1 }}>{children}</div>
      </body>
    </html>
  );
}