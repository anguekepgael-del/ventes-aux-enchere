"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  calculateBuyerDeposit,
  calculateCommission,
  canPlaceBid,
  formatXaf,
  getMinimumNextBid,
} from "@/src/lib/marketplace-core";

type Auction = {
  id: string;
  title: string;
  category: string;
  city: string;
  seller: string;
  startPrice: number;
  currentPrice: number;
  increment: number;
  reservePrice: number;
  buyNow: number;
  endsIn: string;
  urgent: boolean;
  inspected: boolean;
  verifiedSeller: boolean;
  documentValid: boolean;
  delivery: string;
  bg: string;
};

const initialAuctions: Auction[] = [
  {
    id: "phone-01",
    title: "iPhone 14 Pro Max 256 Go",
    category: "Telephones",
    city: "Douala",
    seller: "Kamer Digital SARL",
    startPrice: 650000,
    currentPrice: 840000,
    increment: 25000,
    reservePrice: 900000,
    buyNow: 1180000,
    endsIn: "02:18:44",
    urgent: true,
    inspected: true,
    verifiedSeller: true,
    documentValid: true,
    delivery: "Retrait Akwa ou livraison Douala",
    bg: "linear-gradient(135deg, #1b1b1b, #5f6064 55%, #d98f22)",
  },
  {
    id: "car-01",
    title: "Toyota RAV4 2018 controle technique valide",
    category: "Vehicules",
    city: "Yaounde",
    seller: "Garage Mimboman",
    startPrice: 7800000,
    currentPrice: 8650000,
    increment: 150000,
    reservePrice: 9300000,
    buyNow: 11200000,
    endsIn: "11:05:20",
    urgent: false,
    inspected: true,
    verifiedSeller: true,
    documentValid: true,
    delivery: "Visite sur rendez-vous, transfert admin",
    bg: "linear-gradient(135deg, #101010, #284332 55%, #b9852f)",
  },
  {
    id: "agri-01",
    title: "Lot materiel agricole et pompe d'irrigation",
    category: "Materiel agricole",
    city: "Bafoussam",
    seller: "Cooperative Menoua",
    startPrice: 1250000,
    currentPrice: 1475000,
    increment: 50000,
    reservePrice: 1600000,
    buyNow: 2100000,
    endsIn: "23:40:08",
    urgent: false,
    inspected: true,
    verifiedSeller: true,
    documentValid: false,
    delivery: "Retrait entrepot partenaire",
    bg: "linear-gradient(135deg, #141414, #4d5731 55%, #d98f22)",
  },
  {
    id: "office-01",
    title: "Stock boutique: ordinateurs et imprimantes",
    category: "Stocks de boutique",
    city: "Limbe",
    seller: "Atlantic Office",
    startPrice: 2200000,
    currentPrice: 2540000,
    increment: 75000,
    reservePrice: 2750000,
    buyNow: 3400000,
    endsIn: "05:51:09",
    urgent: true,
    inspected: false,
    verifiedSeller: true,
    documentValid: true,
    delivery: "Livraison disponible",
    bg: "linear-gradient(135deg, #101010, #363637 50%, #cf8a20)",
  },
  {
    id: "jewel-01",
    title: "Parure or 18 carats avec certificat",
    category: "Bijoux",
    city: "Douala",
    seller: "Maison Bessengue",
    startPrice: 980000,
    currentPrice: 1260000,
    increment: 40000,
    reservePrice: 1320000,
    buyNow: 1700000,
    endsIn: "17:12:35",
    urgent: false,
    inspected: true,
    verifiedSeller: true,
    documentValid: true,
    delivery: "Retrait securise point partenaire",
    bg: "linear-gradient(135deg, #070707, #514022 55%, #efb64f)",
  },
  {
    id: "home-01",
    title: "Refrigerateur double porte quasi neuf",
    category: "Electromenager",
    city: "Garoua",
    seller: "Depot Nord",
    startPrice: 280000,
    currentPrice: 345000,
    increment: 15000,
    reservePrice: 390000,
    buyNow: 520000,
    endsIn: "31:22:11",
    urgent: false,
    inspected: true,
    verifiedSeller: false,
    documentValid: true,
    delivery: "Retrait ou transport local",
    bg: "linear-gradient(135deg, #171717, #4e4f52 50%, #d98f22)",
  },
];

const wizardSteps = [
  {
    label: "Bien",
    title: "Informations du bien",
    fields: [
      ["Titre", "iPhone 14 Pro Max 256 Go"],
      ["Categorie", "Telephones"],
      ["Ville", "Douala"],
      ["Etat", "Tres bon"],
    ],
  },
  {
    label: "Prix",
    title: "Prix et conditions d'enchere",
    fields: [
      ["Prix de depart", "650000"],
      ["Palier minimum", "25000"],
      ["Prix de reserve", "900000"],
      ["Achat immediat", "1180000"],
    ],
  },
  {
    label: "Documents",
    title: "Verification et documents",
    fields: [
      ["Piece vendeur", "CNI validee"],
      ["Preuve de propriete", "Facture PDF"],
      ["Inspection", "Agence Douala"],
      ["Photos", "8 images"],
    ],
  },
  {
    label: "Validation",
    title: "Soumission administrative",
    fields: [
      ["Commission estimee", "7.5%"],
      ["Mode retrait", "Point partenaire"],
      ["Paiement", "Sequestre interne"],
      ["Statut", "Pret pour validation"],
    ],
  },
];

const adminCases = [
  ["Toyota RAV4 2018", "Bien", "Inspection juridique", "Moyen"],
  ["Kamer Digital SARL", "Vendeur", "Documents valides", "Faible"],
  ["Parure or 18 carats", "Bien", "Certificat a confirmer", "Moyen"],
  ["Litige #L-204", "Litige", "Paiement en sequestre", "Eleve"],
  ["Signalement #S-881", "Signalement", "Annonce suspecte", "Eleve"],
];

type VisualStyle = CSSProperties & { "--visual-bg": string };

function visualStyle(background: string): VisualStyle {
  return { "--visual-bg": background };
}

export function AuctionPlatform() {
  const [auctions, setAuctions] = useState(initialAuctions);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedAuctionId, setSelectedAuctionId] = useState(initialAuctions[0].id);
  const [depositPaid, setDepositPaid] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [language, setLanguage] = useState("FR");
  const [toast, setToast] = useState("");

  const categories = useMemo(
    () => ["Tous", ...Array.from(new Set(auctions.map((auction) => auction.category)))],
    [auctions],
  );

  const visibleAuctions =
    selectedCategory === "Tous"
      ? auctions
      : auctions.filter((auction) => auction.category === selectedCategory);

  const selectedAuction =
    auctions.find((auction) => auction.id === selectedAuctionId) ?? auctions[0];
  const heroAuction = auctions[0];
  const minimumBid = getMinimumNextBid(selectedAuction);
  const activeStep = wizardSteps[wizardStep];

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function payDeposit() {
    setDepositPaid(true);
    notify("Caution validee via Mobile Money. Vous pouvez encherir.");
  }

  function placeBid(formData: FormData) {
    const bidAmount = Number(formData.get("bidAmount"));
    const result = canPlaceBid({
      user: { identityVerified: true, phoneVerified: true },
      auction: selectedAuction,
      bidAmount,
      depositPaid,
    });

    if (!result.allowed) {
      notify(`Enchere bloquee: ${result.reason}`);
      return;
    }

    setAuctions((current) =>
      current.map((auction) =>
        auction.id === selectedAuction.id ? { ...auction, currentPrice: bidAmount } : auction,
      ),
    );
    notify(`Enchere acceptee a ${formatXaf(bidAmount)}.`);
  }

  return (
    <>
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
            <a href="#seller">Vendeur</a>
            <a href="#buyer">Acheteur</a>
            <a href="#admin">Admin</a>
            <a href="#trust">Confiance</a>
          </nav>
          <div className="header-actions">
            <button
              className="ghost-btn"
              type="button"
              onClick={() => {
                const nextLanguage = language === "FR" ? "EN" : "FR";
                setLanguage(nextLanguage);
                notify(nextLanguage === "FR" ? "Interface en francais" : "English interface preview");
              }}
            >
              {language}
            </button>
            <a className="ghost-btn" href="#auth">
              Connexion
            </a>
            <a className="primary-btn" href="#seller">
              Deposer un bien
            </a>
          </div>
        </header>

        <main>
          <section className="hero-section">
            <div className="hero-copy">
              <p className="eyebrow">Plateforme camerounaise d'encheres verifiees</p>
              <h1>Vendre, acheter et encherir avec une confiance visible.</h1>
              <p className="hero-text">
                Enchere.cm combine verification d'identite, inspection des biens, caution avant
                enchere et paiement bloque avant reversement vendeur.
              </p>
              <div className="hero-actions">
                <a className="primary-btn large" href="#catalogue">
                  Voir les encheres
                </a>
                <a className="secondary-btn large" href="#admin">
                  Explorer le back-office
                </a>
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
                <button className="security-btn" type="button" onClick={payDeposit}>
                  Payer caution
                </button>
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

          <section className="section-block" id="catalogue">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Catalogue</p>
                <h2>Encheres en cours</h2>
              </div>
              <div className="filters" aria-label="Filtres categorie">
                {categories.map((category) => (
                  <button
                    className={`filter-btn ${category === selectedCategory ? "active" : ""}`}
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="catalogue-layout">
              <div className="auction-grid">
                {visibleAuctions.map((auction) => (
                  <article className="auction-card" key={auction.id}>
                    <button
                      className="auction-visual"
                      type="button"
                      onClick={() => setSelectedAuctionId(auction.id)}
                      style={visualStyle(auction.bg)}
                    >
                      <div className="badge-row">
                        <span className={`badge ${auction.verifiedSeller ? "" : "alert"}`}>
                          {auction.verifiedSeller ? "Vendeur verifie" : "Verification en cours"}
                        </span>
                        <span className={`badge ${auction.inspected ? "gold" : "alert"}`}>
                          {auction.inspected ? "Bien inspecte" : "Inspection requise"}
                        </span>
                      </div>
                      <strong>{auction.title}</strong>
                      <span>{auction.city}</span>
                    </button>
                    <div className="auction-body">
                      <div className="auction-meta">
                        <div className="price-stack">
                          <small>Prix actuel</small>
                          <strong>{formatXaf(auction.currentPrice)}</strong>
                        </div>
                        <span className={`badge ${auction.urgent ? "alert" : "gold"}`}>
                          {auction.endsIn}
                        </span>
                      </div>
                      <div className="card-footer">
                        <small>
                          Caution {formatXaf(calculateBuyerDeposit({ startPrice: auction.startPrice }))}
                        </small>
                        <button
                          className="ghost-btn"
                          type="button"
                          onClick={() => setSelectedAuctionId(auction.id)}
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="detail-panel">
                <p className="eyebrow">Dossier verifie</p>
                <h3>{selectedAuction.title}</h3>
                <p>
                  {selectedAuction.city} - {selectedAuction.delivery}
                </p>
                <div className="badge-row">
                  <span className={`badge ${selectedAuction.verifiedSeller ? "" : "alert"}`}>
                    {selectedAuction.verifiedSeller ? "Vendeur verifie" : "Vendeur a verifier"}
                  </span>
                  <span className={`badge ${selectedAuction.documentValid ? "" : "alert"}`}>
                    {selectedAuction.documentValid ? "Document valide" : "Document demande"}
                  </span>
                  <span className="badge gold">Paiement securise</span>
                </div>
                <DetailRow label="Prix actuel" value={formatXaf(selectedAuction.currentPrice)} />
                <DetailRow label="Palier minimum" value={formatXaf(selectedAuction.increment)} />
                <DetailRow label="Prochaine enchere" value={formatXaf(minimumBid)} />
                <DetailRow label="Prix de reserve" value={formatXaf(selectedAuction.reservePrice)} />
                <DetailRow label="Achat immediat" value={formatXaf(selectedAuction.buyNow)} />
                <DetailRow
                  label="Caution"
                  value={
                    depositPaid
                      ? "Payee"
                      : formatXaf(calculateBuyerDeposit({ startPrice: selectedAuction.startPrice }))
                  }
                />
                <DetailRow
                  label="Commission estimee"
                  value={formatXaf(calculateCommission({ finalPrice: selectedAuction.currentPrice }))}
                />
                <form
                  className="bid-control"
                  key={`${selectedAuction.id}-${selectedAuction.currentPrice}`}
                  onSubmit={(event) => {
                    event.preventDefault();
                    placeBid(new FormData(event.currentTarget));
                  }}
                >
                  <input
                    aria-label="Montant de l'enchere"
                    defaultValue={minimumBid}
                    inputMode="numeric"
                    name="bidAmount"
                  />
                  <button className="primary-btn" type="submit">
                    Encherir
                  </button>
                </form>
                <div className="detail-actions">
                  <button className="security-btn" type="button" onClick={payDeposit}>
                    {depositPaid ? "Caution validee" : "Payer caution"}
                  </button>
                  <button
                    className="secondary-btn"
                    type="button"
                    onClick={() => notify("Achat immediat initie: paiement bloque avant reversement vendeur.")}
                  >
                    Achat immediat
                  </button>
                </div>
              </aside>
            </div>
          </section>

          <section className="section-block light" id="trust">
            <SectionIntro eyebrow="Confiance operationnelle" title="Chaque transaction suit un circuit controle." />
            <div className="workflow-grid">
              <WorkflowStep index="01" title="Verification">
                Identite, telephone OTP, documents vendeur et controle du bien avant publication.
              </WorkflowStep>
              <WorkflowStep index="02" title="Caution">
                Depot obligatoire avant enchere pour reduire les faux encherisseurs.
              </WorkflowStep>
              <WorkflowStep index="03" title="Sequestre">
                Paiement bloque pendant la validation, livraison ou retrait en point partenaire.
              </WorkflowStep>
              <WorkflowStep index="04" title="Reversement">
                Commission deduite, facture generee et paiement vendeur declenche par finance.
              </WorkflowStep>
            </div>
          </section>

          <section className="section-block dashboard-band" id="seller">
            <SectionIntro eyebrow="Espace vendeur" title="Depot de bien en plusieurs etapes" />
            <div className="seller-layout">
              <div className="wizard">
                <div className="step-tabs">
                  {wizardSteps.map((step, index) => (
                    <button
                      className={index === wizardStep ? "active" : ""}
                      key={step.label}
                      type="button"
                      onClick={() => setWizardStep(index)}
                    >
                      {index + 1}. {step.label}
                    </button>
                  ))}
                </div>
                <h3>{activeStep.title}</h3>
                <div className="wizard-fields">
                  {activeStep.fields.map(([label, value]) => (
                    <label key={label}>
                      {label}
                      <input defaultValue={value} />
                    </label>
                  ))}
                </div>
                <div className="card-footer wizard-footer">
                  <span className="badge gold">Validation administrative obligatoire</span>
                  <button
                    className="primary-btn"
                    type="button"
                    onClick={() =>
                      wizardStep === wizardSteps.length - 1
                        ? notify("Bien soumis au controle administratif.")
                        : setWizardStep((step) => step + 1)
                    }
                  >
                    {wizardStep === wizardSteps.length - 1 ? "Soumettre" : "Continuer"}
                  </button>
                </div>
              </div>
              <div className="seller-summary">
                <h3>Statut vendeur</h3>
                <div className="status-list">
                  <span>
                    <strong>Identite confirmee</strong>
                    <small>CNI validee</small>
                  </span>
                  <span>
                    <strong>Telephone OTP</strong>
                    <small>+237 6XX XXX XXX</small>
                  </span>
                  <span>
                    <strong>Documents</strong>
                    <small>2 fichiers valides</small>
                  </span>
                  <span>
                    <strong>Badge</strong>
                    <small>Vendeur verifie</small>
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="section-block light" id="buyer">
            <SectionIntro eyebrow="Espace acheteur" title="Suivi des encheres, cautions et messages" />
            <div className="buyer-grid">
              <BuyerCard label="Encheres actives" value="3" detail="dont 1 bientot terminee" />
              <BuyerCard
                label="Cautions bloquees"
                value={formatXaf(
                  auctions
                    .slice(0, 2)
                    .reduce(
                      (total, auction) =>
                        total + calculateBuyerDeposit({ startPrice: auction.startPrice }),
                      0,
                    ),
                )}
                detail="remboursables selon resultat"
              />
              <BuyerCard label="Messagerie" value="4" detail="messages support et vendeur" />
              <BuyerCard alert label="Litiges" value="1" detail="dossier en mediation" />
            </div>
          </section>

          <section className="section-block admin-section" id="admin">
            <SectionIntro eyebrow="Back-office" title="Command center administrateur" />
            <div className="admin-layout">
              <aside className="admin-rail" aria-label="Roles">
                {["Super admin", "Verification", "Finance", "Support", "Moderation"].map((role, index) => (
                  <button className={index === 0 ? "active" : ""} key={role} type="button">
                    {role}
                  </button>
                ))}
              </aside>
              <div className="admin-board">
                <div className="admin-stats">
                  <article>
                    <strong>18</strong>
                    <span>biens a valider</span>
                  </article>
                  <article>
                    <strong>7</strong>
                    <span>vendeurs en revue</span>
                  </article>
                  <article>
                    <strong>12.6M</strong>
                    <span>FCFA en sequestre</span>
                  </article>
                  <article>
                    <strong>3</strong>
                    <span>signalements critiques</span>
                  </article>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Dossier</th>
                        <th>Type</th>
                        <th>Statut</th>
                        <th>Risque</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminCases.map(([name, type, status, risk]) => (
                        <tr key={name}>
                          <td>
                            <strong>{name}</strong>
                          </td>
                          <td>{type}</td>
                          <td>{status}</td>
                          <td>
                            <span className={`badge ${risk === "Eleve" ? "alert" : risk === "Moyen" ? "gold" : ""}`}>
                              {risk}
                            </span>
                          </td>
                          <td>
                            <button className="filter-btn" type="button" onClick={() => notify(`Dossier ouvert: ${name}`)}>
                              Traiter
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section className="section-block light" id="auth">
            <SectionIntro eyebrow="Acces securise" title="Connexion avec OTP et future 2FA admin" />
            <div className="auth-card inline-auth">
              <label>
                Email
                <input defaultValue="acheteur@enchere.cm" type="email" />
              </label>
              <label>
                Mot de passe
                <input defaultValue="cameroon-auction" type="password" />
              </label>
              <label>
                Code OTP
                <input defaultValue="482910" />
              </label>
              <button className="primary-btn full" type="button" onClick={() => notify("Session prototype validee.")}>
                Valider
              </button>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div>
            <strong>Enchere.cm</strong>
            <span>Douala, Yaounde, Bafoussam, Garoua, Limbe, Kribi</span>
          </div>
          <nav aria-label="Pages legales">
            <a href="#top">CGU</a>
            <a href="#top">Confidentialite</a>
            <a href="#top">Biens interdits</a>
            <a href="#top">Litiges</a>
          </nav>
        </footer>
      </div>

      <a className="whatsapp-float" href="https://wa.me/237600000000" aria-label="Support WhatsApp">
        WA<span>Support</span>
      </a>
      <div className={`toast ${toast ? "visible" : ""}`}>{toast}</div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-row">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function SectionIntro({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

function WorkflowStep({
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

function BuyerCard({
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
