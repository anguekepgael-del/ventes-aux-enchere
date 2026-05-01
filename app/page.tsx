import Link from "next/link";
import { PageShell, visualStyle } from "@/src/components/site-chrome";
import { demoAuctions } from "@/src/lib/demo-data";
import { calculateBuyerDeposit, formatXaf } from "@/src/lib/marketplace-core";

const portals = [
  ["Catalogue", "Explorer les encheres actives avec filtres et detail complet.", "/catalogue"],
  ["Espace vendeur", "Deposer un bien, ajouter documents et suivre la validation.", "/vendeur"],
  ["Espace acheteur", "Suivre les cautions, encheres, messages et litiges.", "/acheteur"],
  ["Back-office", "Controler vendeurs, biens, paiements et signalements.", "/admin"],
];

export default function HomePage() {
  const heroAuction = demoAuctions[0];

  return (
    <PageShell>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Plateforme camerounaise d'encheres verifiees</p>
          <h1>Vendre, acheter et encherir avec une confiance visible.</h1>
          <p className="hero-text">
            Enchere.cm devient un vrai site multi-pages : chaque espace a son propre parcours,
            ses controles et ses decisions transactionnelles.
          </p>
          <div className="hero-actions">
            <Link className="primary-btn large" href="/catalogue">
              Voir les encheres
            </Link>
            <Link className="secondary-btn large" href="/admin">
              Explorer le back-office
            </Link>
          </div>
          <div className="trust-strip" aria-label="Indicateurs de confiance">
            <span>Paiement securise</span>
            <span>OTP telephone</span>
            <span>Support WhatsApp</span>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Enchere active">
          <div className="live-header">
            <span className="live-dot" />
            <span>Enchere live</span>
            <strong>{heroAuction.endsIn}</strong>
          </div>
          <div className="auction-visual" style={visualStyle(heroAuction.bg)}>
            <div className="badge-row">
              <span className="badge">Vendeur verifie</span>
              <span className="badge gold">Bien inspecte</span>
            </div>
            <strong>{heroAuction.title}</strong>
            <span>
              {heroAuction.city} - {heroAuction.seller}
            </span>
          </div>
          <div className="escrow-module">
            <div>
              <small>Caution requise</small>
              <strong>{formatXaf(calculateBuyerDeposit({ startPrice: heroAuction.startPrice }))}</strong>
            </div>
            <Link className="security-btn" href="/catalogue">
              Encherir
            </Link>
          </div>
        </aside>
      </section>

      <section className="metrics-band" aria-label="Statistiques de confiance">
        <article>
          <strong>2 840+</strong>
          <span>utilisateurs verifies</span>
        </article>
        <article>
          <strong>96%</strong>
          <span>biens controles avant publication</span>
        </article>
        <article>
          <strong>5</strong>
          <span>canaux de paiement prioritaires</span>
        </article>
        <article>
          <strong>8</strong>
          <span>roles d'administration</span>
        </article>
      </section>

      <section className="section-block light">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Navigation du produit</p>
            <h2>Chaque espace ouvre maintenant sa propre page.</h2>
          </div>
        </div>
        <div className="portal-grid">
          {portals.map(([title, text, href]) => (
            <Link className="portal-card" href={href} key={href}>
              <span className="badge gold">Page dediee</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
