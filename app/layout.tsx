import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./interactive.css";
import "./codex-fixes.css";

export const metadata: Metadata = {
  title: "Enchere.cm | Encheres securisees au Cameroun",
  description:
    "Plateforme camerounaise d'encheres en ligne avec caution, verification, paiement securise et back-office.",
  metadataBase: new URL("https://enchere.cm"),
  openGraph: {
    title: "Enchere.cm",
    description: "Encheres securisees, vendeurs verifies et paiements bloques.",
    type: "website",
    locale: "fr_CM",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
