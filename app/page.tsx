import Link from "next/link";
import { demoAuctions } from "@/src/lib/demo-data";
import {
  calculateBuyerDeposit,
  calculateCommission,
  calculateSellerPayout,
  formatXaf,
} from "@/src/lib/marketplace-core";
import { visualStyle } from "@/src/lib/visual-style";

const stats = [
  ["Vendeurs verifies", "+1 200", "users"],
  ["Articles inspectes", "+2 500", "key"],
  ["Transactions securisees", "+8 300", "wallet"],
  ["Satisfaction", "98%", "shield"],
];

const payments = ["Orange Money", "MTN MoMo", "VISA", "Mastercard", "Virement bancaire", "Paiement manuel"];

const dashboardCards = [
  ["Encheres en cours", "4"],
  ["Achats remportes", "2"],
  ["Ventes en cours", "3"],
  ["Portefeuille", "2 450 000 XAF"],
];

export default function HomePage() {
  const featuredAuction = demoAuctions[1];
  const liveAuctions = [demoAuctions[1], demoAuctions[2], demoAuctions[0]];
  const settlement = calculateSellerPayout({ finalPrice: featuredAuction.currentPrice });

  return (
    <main className="agency-site">
      <header className="agency-header">
        <Link className="agency-brand" href="/" aria-label="Enchere.cm accueil">
          <span className="agency-brand-icon">E</span>
          <span>
            <strong>
              Enchere<span>.cm</span>
            </strong>
            <small>Encherissez en toute confiance</small>
          </span>
        </Link>

        <nav className="agency-nav" aria-label="Navigation principale">
          <Link href="/catalogue">Acheter</Link>
          <Link href="/vendeur">Vendre</Link>
          <Link href="/comment-ca-marche">Comment ca marche</Link>
          <Link href="/confiance">A propos</Link>
        </nav>

        <div className="agency-actions">
          <Link className="agency-btn ghost" href="/connexion">
            Se connecter
          </Link>
          <Link className="agency-btn primary" href="/auth/inscription">
            S'inscrire
          </Link>
        </div>
      </header>

      <section className="agency-hero">
        <div className="agency-hero-copy">
          <p className="agency-pill">Plateforme d'encheres securisee au Cameroun</p>
          <h1>
            Encherissez.
            <br />
            Achetez. Vendez.
            <br />
            <span>En toute confiance.</span>
          </h1>
          <p>
            La plateforme d'encheres en ligne no1 au Cameroun. Des vendeurs verifies, des
            paiements securises et des transactions en toute transparence.
          </p>
          <div className="agency-hero-actions">
            <Link className="agency-btn primary large" href="/catalogue">
              Participer aux encheres
            </Link>
            <Link className="agency-btn ghost large" href="/vendeur">
              Vendre un article
            </Link>
          </div>
        </div>

        <div className="agency-hero-visual">
          <div className="agency-trust-card">
            <span className="agency-icon shield" />
            <span>
              Transactions
              <strong>100% securisees</strong>
            </span>
          </div>
          <div
            className="agency-car"
            role="img"
            aria-label={featuredAuction.imageAlt}
            style={visualStyle(featuredAuction.bg, featuredAuction.imageUrl)}
          />
        </div>
      </section>

      <section className="agency-proof" aria-label="Indicateurs et paiements acceptes">
        <div className="agency-stats">
          {stats.map(([label, value, icon]) => (
            <article key={label}>
              <span className={`agency-stat-icon ${icon}`} />
              <small>{label}</small>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
        <div className="agency-payments">
          <span>Paiements acceptes</span>
          {payments.map((payment) => (
            <strong key={payment}>{payment}</strong>
          ))}
        </div>
      </section>

      <section className="agency-live">
        <div className="agency-section-title">
          <div>
            <h2>Encheres en direct</h2>
            <span>12 en cours</span>
          </div>
          <Link href="/catalogue">Voir toutes les encheres</Link>
        </div>

        <div className="agency-live-layout">
          <div className="agency-auction-grid">
            {liveAuctions.map((auction) => (
              <article className="agency-auction-card" key={auction.id}>
                <div
                  className="agency-card-media"
                  role="img"
                  aria-label={auction.imageAlt}
                  style={visualStyle(auction.bg, auction.imageUrl)}
                >
                  <div className="agency-card-badges">
                    <span>Enchere</span>
                    <span className="green">{auction.inspected ? "Inspecte" : "Verifie"}</span>
                  </div>
                  <span className="agency-countdown">{auction.endsIn}</span>
                </div>
                <div className="agency-card-body">
                  <h3>{auction.title}</h3>
                  <p>{auction.city}</p>
                  <div className="agency-card-meta">
                    <span>
                      Enchere actuelle
                      <strong>{formatXaf(auction.currentPrice)}</strong>
                    </span>
                    <span>
                      Encheres
                      <strong>{auction.urgent ? "23" : "17"}</strong>
                    </span>
                  </div>
                  <div className="agency-card-actions">
                    <Link className="agency-btn ghost compact" href={`/catalogue/${auction.id}`}>
                      Details
                    </Link>
                    <Link className="agency-btn primary compact" href={`/catalogue/${auction.id}`}>
                      Encherir
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="agency-phone" aria-label="Apercu mobile">
            <div className="agency-phone-screen">
              <div className="agency-phone-top">
                <span className="agency-brand-icon small">E</span>
                <strong>Enchere.cm</strong>
                <span className="agency-menu" />
              </div>
              <p className="agency-pill mini">Plateforme securisee au Cameroun</p>
              <h3>
                Encherissez.
                <br />
                Achetez. Vendez.
                <span> En toute confiance.</span>
              </h3>
              <Link className="agency-btn primary full" href="/catalogue">
                Participer aux encheres
              </Link>
              <Link className="agency-btn ghost full" href="/vendeur">
                Vendre un article
              </Link>
              <div className="agency-mini-stats">
                <span>Vendeurs verifies +1 200</span>
                <span>Transactions +8 300</span>
              </div>
              <div
                className="agency-mobile-card"
                role="img"
                aria-label={featuredAuction.imageAlt}
                style={visualStyle(featuredAuction.bg, featuredAuction.imageUrl)}
              />
            </div>
          </aside>
        </div>
      </section>

      <section className="agency-security">
        <div className="agency-lock">
          <span />
        </div>
        <div>
          <div className="agency-security-title">
            <h2>Caution & Paiement securises</h2>
            <span>Secure</span>
          </div>
          <p>
            Les fonds sont places en caution sur Enchere.cm et liberes uniquement apres
            validation de la transaction.
          </p>
          <div className="agency-flow">
            <article>
              <span className="agency-icon shield" />
              <strong>1. Caution</strong>
              <small>Depot securise de l'acheteur</small>
            </article>
            <i />
            <article>
              <span className="agency-icon shield" />
              <strong>2. Validation</strong>
              <small>Confirmation reception / inspection</small>
            </article>
            <i />
            <article>
              <span className="agency-icon payout" />
              <strong>3. Liberation</strong>
              <small>Paiement libere au vendeur</small>
            </article>
          </div>
        </div>
      </section>

      <section className="agency-support">
        <div className="agency-whatsapp">WA</div>
        <div>
          <h2>Besoin d'aide ?</h2>
          <p>Notre equipe est disponible sur WhatsApp.</p>
        </div>
        <Link className="agency-btn ghost compact" href="https://wa.me/237600000000">
          Discuter sur WhatsApp
        </Link>
      </section>

      <section className="agency-dashboard">
        <aside className="agency-sidebar">
          <Link className="agency-brand dashboard-brand" href="/">
            <span className="agency-brand-icon">E</span>
            <strong>
              Enchere<span>.cm</span>
            </strong>
          </Link>
          <small>Tableau de bord</small>
          {["Accueil", "Mes encheres", "Mes achats", "Mes ventes", "Messages", "Paiements", "Favoris"].map(
            (item, index) => (
              <span className={index === 0 ? "active" : ""} key={item}>
                {item}
              </span>
            ),
          )}
          <small>Compte</small>
          {["Profil", "Parametres", "Securite", "Centre d'aide"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </aside>

        <div className="agency-dashboard-main">
          <div className="agency-dashboard-head">
            <div>
              <h2>Bonjour, Jean</h2>
              <p>Voici un apercu de votre activite.</p>
            </div>
            <span>Role actuel : Acheteur</span>
          </div>
          <div className="agency-dashboard-cards">
            {dashboardCards.map(([label, value]) => (
              <article key={label}>
                <small>{label}</small>
                <strong>{value}</strong>
              </article>
            ))}
          </div>
          <div className="agency-admin-queue">
            <div className="agency-queue-title">
              <h3>File d'attente de verification Admin</h3>
              <Link href="/admin">Voir tout</Link>
            </div>
            {liveAuctions.map((auction, index) => (
              <div className="agency-queue-row" key={auction.id}>
                <div
                  className="agency-row-thumb"
                  role="img"
                  aria-label={auction.imageAlt}
                  style={visualStyle(auction.bg, auction.imageUrl)}
                />
                <strong>{auction.title}</strong>
                <span>{auction.seller}</span>
                <span>{index === 0 ? "18/05/2025" : "17/05/2025"}</span>
                <span className="queue-status">En attente</span>
                <Link className="agency-btn primary compact" href="/admin">
                  Examiner
                </Link>
              </div>
            ))}
          </div>
          <div className="agency-bottom-trust">
            <span>Plateforme 100% camerounaise</span>
            <span>Donnees chiffrees et protegees</span>
            <span>Conforme aux normes de securite</span>
            <span>Support reactif 7j/7</span>
          </div>
        </div>
      </section>

      <footer className="agency-footer">
        <span>Commission estimee : {formatXaf(calculateCommission({ finalPrice: featuredAuction.currentPrice }))}</span>
        <span>Caution : {formatXaf(calculateBuyerDeposit({ startPrice: featuredAuction.startPrice }))}</span>
        <span>Reversement vendeur : {formatXaf(settlement.payout)}</span>
      </footer>

      <Link className="agency-floating-wa" href="https://wa.me/237600000000" aria-label="Support WhatsApp">
        WA
      </Link>
    </main>
  );
}
