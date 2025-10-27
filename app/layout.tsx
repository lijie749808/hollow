import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://hollowknightsaveeditor.xyz'),
  title: {
    default: "Hollow Knight Save Editor - Online Save File Editor & Modifier Tool",
    template: "%s | Hollow Knight Save Editor"
  },
  description: "Professional Hollow Knight save editor - Edit and modify your Hollow Knight game save files online for PC (Steam/GOG) and Nintendo Switch. Free hollow knight save editor tool with JSON editing, encryption/decryption support. Easily modify geo, health, charms, skills, map progress and more with this advanced hollow knight save editor.",
  keywords: "hollow knight save editor, save file editor, hollow knight save modifier, game save editor, hollow knight pc save editor, hollow knight switch save editor, save file modifier, hollow knight cheats, hollow knight editor online, hollow knight save file location, hollow knight save editor pc, hollow knight save editor switch",
  openGraph: {
    title: "Hollow Knight Save Editor - Free Online Save File Editor",
    description: "Professional hollow knight save editor online tool - Modify your save files for PC and Nintendo Switch. Free, secure, and easy to use.",
    url: "https://hollowknightsaveeditor.xyz",
    siteName: "Hollow Knight Save Editor",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hollow Knight Save Editor - Online Tool"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hollow Knight Save Editor - Online Save File Editor",
    description: "Free online hollow knight save editor for PC and Nintendo Switch. Edit game saves, modify geo, health, charms and more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: "Hollow Knight Save Editor Team", url: "https://hollowknightsaveeditor.xyz" }],
  creator: "Hollow Knight Save Editor",
  publisher: "Hollow Knight Save Editor",
  alternates: {
    canonical: "https://hollowknightsaveeditor.xyz",
  },
  category: "Gaming Tools",
  applicationName: "Hollow Knight Save Editor",
  verification: {
    google: "your-google-verification-code", // 替换为实际的 Google Search Console 验证码
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: '/favicon.ico?v=2' },
      { url: '/icon-192.png?v=2', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png?v=2', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E414JDL1P6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E414JDL1P6');
          `}
        </Script>
        
        {children}
      </body>
    </html>
  );
}
