import type { CSSProperties } from "react";

export default function HomePage() {
  const auctions = [
    ["iPhone 14 Pro Max 256 Go", "Douala", "840 000 FCFA", "02:18:44", "Vendeur verifie"],
    ["Toyota RAV4 2018 controle valide", "Yaounde", "8 650 000 FCFA", "11:05:20", "Bien inspecte"],
    ["Lot materiel agricole", "Bafoussam", "1 475 000 FCFA", "23:40:08", "Document demande"],
  ];

  return (
    <div className="app-shell">
      <header className="site-header" id="top">
        <a className="brand" href="#top" aria-label="Enchere.cm accueil">
          <span className="brand-mark">E</span>
          <span>
            <strong>Enchere.cm</strong>
            <small>Verified auctions Cameroon</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Navigation principale">
          <a href="#catalogue">Catalogue</a>
          <a href="#trust">Confiance</a>
          <a href="#admin">Admin</a>
          <a href="#architecture">Architecture</a>
        </nav>
        <div className="header-actions">
          <a className="ghost-btn" href="#auth">Connexion</a>
          <a className="primary-btn" href="#catalogue">Encherir</a>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Plateforme camerounaise d'encheres verifiees</p>
            <h1>Vendre, acheter et encherir avec une confiance visible.</h1>
            <p className="hero-text">
              Application Next.js deployable sur Vercel, protegee par Cloudflare, preparee pour
              PostgreSQL, stockage securise, Mobile Money et temps reel externe.
            </p>
            <div className="hero-actions">
              <a className="primary-btn large" href="#catalogue">Voir les encheres</a>
              <a className="secondary-btn large" href="#architecture">Voir l'architecture</a>
            </div>
            <div className="trust-strip" aria-label="Indicateurs de confiance">
              <span>Cloudflare WAF</span>
              <span>Vercel Next.js</span>
              <span>PostgreSQL ready</span>
            </div>
          </div>

          <aside className="hero-panel" aria-label="Enchere active">
            <div className="live-header"><span className="live-dot" /><span>Enchere live</span><strong>02:18:44</strong></div>
            <div className="auction-visual" style={{ "--visual-bg": "linear-gradient(135deg, #1b1b1b, #5f6064 55%, #d98f22)" } as CSSProperties}>
              <div className="badge-row"><span className="badge">Vendeur verifie</span><span className="badge gold">Bien inspecte</span></div>
              <strong>iPhone 14 Pro Max 256 Go</strong>
              <span>Douala - Kamer Digital SARL</span>
            </div>
            <div className="escrow-module">
              <div><small>Caution requise</small><strong>90 000 FCFA</strong></div>
              <a className="security-btn" href="#architecture">Mobile Money</a>
            </div>
          </aside>
        </section>

        <section className="metrics-band" aria-label="Statistiques de confiance">
          <article><strong>2 840+</strong><span>utilisateurs verifies</span></article>
          <article><strong>96%</strong><span>biens controles avant publication</span></article>
          <article><strong>5</strong><span>canaux de paiement prioritaires</span></article>
          <article><strong>8</strong><span>roles d'administration</span></article>
        </section>

        <section className="section-block" id="catalogue">
          <div className="section-heading"><div><p className="eyebrow">Catalogue</p><h2>Encheres en cours</h2></div></div>
          <div className="auction-grid">
            {auctions.map(([title, city, price, endsIn, badge]) => (
              <article className="auction-card" key={title}>
                <div className="auction-visual" style={{ "--visual-bg": "linear-gradient(135deg, #101010, #363637 50%, #cf8a20)" } as CSSProperties}>
                  <div className="badge-row"><span className="badge gold">{badge}</span></div>
                  <strong>{title}</strong><span>{city}</span>
                </div>
                <div className="auction-body">
                  <div className="auction-meta"><div className="price-stack"><small>Prix actuel</small><strong>{price}</strong></div><span className="badge alert">{endsIn}</span></div>
                  <div className="card-footer"><small>Caution obligatoire avant enchere</small><span className="badge">Paiement securise</span></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block light" id="trust">
          <div className="section-heading"><div><p className="eyebrow">Confiance operationnelle</p><h2>Chaque transaction suit un circuit controle.</h2></div></div>
          <div className="workflow-grid">
            <article><span>01</span><h3>Verification</h3><p>Identite, telephone OTP, documents vendeur et controle du bien.</p></article>
            <article><span>02</span><h3>Caution</h3><p>Depot obligatoire avant enchere pour reduire les faux encherisseurs.</p></article>
            <article><span>03</span><h3>Sequestre</h3><p>Paiement bloque pendant la validation, livraison ou retrait partenaire.</p></article>
            <article><span>04</span><h3>Reversement</h3><p>Commission deduite, facture generee et paiement vendeur par finance.</p></article>
          </div>
        </section>

        <section className="section-block admin-section" id="admin">
          <div className="section-heading"><div><p className="eyebrow">Back-office</p><h2>Command center administrateur</h2></div></div>
          <div className="admin-layout">
            <aside className="admin-rail" aria-label="Roles">
              <button className="active" type="button">Super admin</button>
              <button type="button">Verification</button>
              <button type="button">Finance</button>
              <button type="button">Support</button>
              <button type="button">Moderation</button>
            </aside>
            <div className="admin-board"><div className="admin-stats"><article><strong>18</strong><span>biens a valider</span></article><article><strong>7</strong><span>vendeurs en revue</span></article><article><strong>12.6M</strong><span>FCFA en sequestre</span></article><article><strong>3</strong><span>signalements critiques</span></article></div></div>
          </div>
        </section>

        <section className="section-block light" id="architecture">
          <div className="section-heading"><div><p className="eyebrow">Architecture evolutive</p><h2>Vercel, Cloudflare, PostgreSQL, stockage et temps reel.</h2></div></div>
          <div className="workflow-grid">
            <article><span>DNS</span><h3>Cloudflare</h3><p>DNS proxifie, DDoS, WAF, CDN, rate limits et regles de securite.</p></article>
            <article><span>APP</span><h3>Vercel Next.js</h3><p>App Router, API routes, deployments GitHub et headers securite.</p></article>
            <article><span>DATA</span><h3>PostgreSQL + S3</h3><p>Transactions financieres, documents prives et URLs signees.</p></article>
            <article><span>LIVE</span><h3>Realtime externe</h3><p>Ably, Pusher, Supabase Realtime ou Durable Objects pour les encheres.</p></article>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div><strong>Enchere.cm</strong><span>Douala, Yaounde, Bafoussam, Garoua, Limbe, Kribi</span></div><nav aria-label="Pages legales"><a href="#top">CGU</a><a href="#top">Confidentialite</a><a href="#top">Biens interdits</a><a href="#top">Litiges</a></nav></footer>
      <a className="whatsapp-float" href="https://wa.me/237600000000" aria-label="Support WhatsApp">WA<span>Support</span></a>
    </div>
  );
}
