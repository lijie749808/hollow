import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hollow Knight Silksong Save Editor - Visual Online Tool for PC & Switch",
  description: "Professional hollow knight silksong save editor with visual interface. Edit Silksong save files for PC and Nintendo Switch. Free online silksong save editor tool with Crest management, tool unlocking, and stat modification. No JSON knowledge required!",
  keywords: "hollow knight silksong save editor, silksong save editor, hollow knight silksong save modifier, silksong save file editor, hollow knight silksong pc save editor, hollow knight silksong switch save editor, silksong visual editor, silksong crest editor, hornet save editor",
  openGraph: {
    title: "Hollow Knight Silksong Save Editor - Visual Tool",
    description: "Professional hollow knight silksong save editor online tool with visual interface. Modify Silksong saves for PC and Switch. Free, secure, and easy to use.",
    url: "https://hollowknightsaveeditor.xyz/silksong",
    siteName: "Hollow Knight Silksong Save Editor",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hollow Knight Silksong Save Editor - Visual Online Tool",
    description: "Free hollow knight silksong save editor with visual interface for PC and Nintendo Switch. Edit saves, unlock tools, manage Crests and more.",
  },
  alternates: {
    canonical: "https://hollowknightsaveeditor.xyz/silksong",
  },
};

export default function SilksongLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

