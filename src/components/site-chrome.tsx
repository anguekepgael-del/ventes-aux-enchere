"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Enchere.cm accueil">
        <span className="brand-mark">E</span>
        <span>
          <strong>Enchere.cm</strong>
          <small>Verified auctions Cameroon</small>
        </span>
      </Link>
      <nav className="nav-links" aria-label="Navigation principale">
        <Link href="/catalogue">Catalogue</Link>
        <Link href="/vendeur">Vendeur</Link>
        <Link href="/acheteur">Acheteur</Link>
        <Link href="/operations">Operations</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/confiance">Confiance</Link>
      </nav>
      <div className="header-actions">
        <Link className="ghost-btn" href="/connexion">
          Connexion
        </Link>
        <Link className="primary-btn" href="/vendeur">
          Deposer un bien
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <>
      <footer className="site-footer">
        <div>
          <strong>Enchere.cm</strong>
          <span>Douala, Yaounde, Bafoussam, Garoua, Limbe, Kribi</span>
        </div>
        <nav aria-label="Pages legales">
          <Link href="/confiance">CGU</Link>
          <Link href="/confiance">Confidentialite</Link>
          <Link href="/operations">Biens interdits</Link>
          <Link href="/admin">Litiges</Link>
        </nav>
      </footer>
      <a className="whatsapp-float" href="https://wa.me/237600000000" aria-label="Support WhatsApp">
        WA<span>Support</span>
      </a>
    </>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SectionIntro({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-row">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

export function WorkflowStep({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article>
      <span>{index}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

export function BuyerCard({
  label,
  value,
  detail,
  alert = false,
}: {
  label: string;
  value: string;
  detail: string;
  alert?: boolean;
}) {
  return (
    <article className={`buyer-card ${alert ? "alert-card" : ""}`}>
      <small>{label}</small>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}
