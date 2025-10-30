import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://hollowknightsaveeditor.xyz'),
  title: {
    default: "Hollow Knight Silksong Save Editor - Visual Online Tool for PC & Switch",
    template: "%s | Hollow Knight Save Editor"
  },
  description: "Professional hollow knight silksong save editor with visual interface. Edit Silksong save files for PC and Nintendo Switch. Free online silksong save editor tool with Crest management, tool unlocking, and stat modification. No JSON knowledge required!",
  keywords: ["hollow knight silksong save editor", "silksong save editor", "hollow knight silksong save modifier", "silksong save file editor", "hollow knight silksong pc save editor", "hollow knight silksong switch save editor", "silksong visual editor", "silksong crest editor", "hornet save editor"],
  authors: [{ name: "Hollow Knight Save Editor Team" }],
  publisher: "Hollow Knight Save Editor Team",
  category: "Gaming Tools",
  applicationName: "Hollow Knight Silksong Save Editor",
  openGraph: {
    title: "Hollow Knight Silksong Save Editor - Visual Tool",
    description: "Professional hollow knight silksong save editor online tool with visual interface. Modify Silksong saves for PC and Switch. Free, secure, and easy to use.",
    url: "https://hollowknightsaveeditor.xyz/silksong",
    siteName: "Hollow Knight Silksong Save Editor",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://hollowknightsaveeditor.xyz/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hollow Knight Silksong Save Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hollow Knight Silksong Save Editor - Visual Online Tool",
    description: "Free hollow knight silksong save editor with visual interface for PC and Nintendo Switch. Edit saves, unlock tools, manage Crests and more.",
    images: ["https://hollowknightsaveeditor.xyz/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://hollowknightsaveeditor.xyz/silksong",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function SilksongLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

