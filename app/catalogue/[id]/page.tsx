import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailRow, PageShell, SectionIntro } from "@/src/components/site-chrome";
import { demoAuctions, getDemoAuctionById } from "@/src/lib/demo-data";
import {
  calculateCommission,
  calculateSellerPayout,
  formatXaf,
  getAntiSnipingEndTime,
  getDepositPolicy,
  getMinimumNextBid,
} from "@/src/lib/marketplace-core";
import { visualStyle } from "@/src/lib/visual-style";

type AuctionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return demoAuctions.map((auction) => ({ id: auction.id }));
}

export async function generateMetadata({ params }: AuctionDetailPageProps) {
  const { id } = await params;
  const auction = getDemoAuctionById(id);

  if (!auction) {
    return {
      title: "Bien introuvable | Enchere.cm",
    };
  }

  return {
    title: `${auction.title} | Enchere.cm`,
    description: `${auction.title} aux encheres a ${auction.city}. Caution, documents et paiement securise.`,
  };
}

export default async function AuctionDetailPage({ params }: AuctionDetailPageProps) {
  const { id } = await params;
  const auction = getDemoAuctionById(id);

  if (!auction) {
    notFound();
  }

  const depositPolicy = getDepositPolicy({ startPrice: auction.startPrice });
  const commission = calculateCommission({ finalPrice: auction.currentPrice });
  const payout = calculateSellerPayout({ finalPrice: auction.currentPrice });
  const nextBid = getMinimumNextBid(auction);
  const antiSnipingExample = getAntiSnipingEndTime({
    auctionEndsAt: new Date("2026-05-02T12:00:00.000Z"),
    bidAt: new Date("2026-05-02T11:59:00.000Z"),
  });

  return (
    <PageShell>
      <section className="section-block route-hero auction-detail-hero">
        <div className="detail-hero-grid">
          <div>
            <Link className="ghost-btn detail-back-link" href="/catalogue">
              Retour catalogue
            </Link>
            <p className="eyebrow">{auction.category}</p>
            <h1>{auction.title}</h1>
            <p className="hero-text">
              Dossier de vente verifie a {auction.city}. Participation soumise a caution,
              controle vendeur et paiement bloque avant reversement.
            </p>
            <div className="badge-row">
              <span className={`badge ${auction.verifiedSeller ? "" : "alert"}`}>
                {auction.verifiedSeller ? "Vendeur verifie" : "Vendeur a verifier"}
              </span>
              <span className={`badge ${auction.inspected ? "gold" : "alert"}`}>
                {auction.inspected ? "Bien inspecte" : "Inspection requise"}
              </span>
              <span className={`badge ${auction.documentValid ? "" : "alert"}`}>
                {auction.documentValid ? "Document valide" : "Document demande"}
              </span>
              <span className="badge gold">Paiement securise</span>
            </div>
          </div>

          <div
            className="auction-visual detail-hero-media"
            role="img"
            aria-label={auction.imageAlt}
            style={visualStyle(auction.bg, auction.imageUrl)}
          >
            <span className={`badge ${auction.urgent ? "alert" : "gold"}`}>{auction.endsIn}</span>
            <strong>{formatXaf(auction.currentPrice)}</strong>
            <span>Prix actuel</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="auction-detail-layout">
          <article className="detail-panel detail-panel-light">
            <SectionIntro eyebrow="Enchere" title="Prix, caution et achat immediat" />
            <DetailRow label="Prix de depart" value={formatXaf(auction.startPrice)} />
            <DetailRow label="Prix actuel" value={formatXaf(auction.currentPrice)} />
            <DetailRow label="Prochaine enchere minimale" value={formatXaf(nextBid)} />
            <DetailRow label="Palier minimum" value={formatXaf(auction.increment)} />
            <DetailRow label="Prix de reserve" value={formatXaf(auction.reservePrice)} />
            <DetailRow label="Achat immediat" value={formatXaf(auction.buyNow)} />
            <DetailRow
              label={depositPolicy.required ? "Caution obligatoire" : "Caution"}
              value={depositPolicy.amount > 0 ? formatXaf(depositPolicy.amount) : "Optionnelle"}
            />
            <DetailRow
              label="Verification"
              value={depositPolicy.verification === "enhanced" ? "Renforcee" : "Standard"}
            />
            <div className="detail-actions">
              <Link className="security-btn" href="/connexion">
                Payer caution
              </Link>
              <Link className="primary-btn" href="/connexion">
                Encherir
              </Link>
            </div>
          </article>

          <article className="detail-panel detail-panel-light">
            <SectionIntro eyebrow="Sequestre" title="Paiement bloque et reversement" />
            <DetailRow label="Commission estimee" value={formatXaf(commission)} />
            <DetailRow label="Reversement vendeur estime" value={formatXaf(payout.payout)} />
            <DetailRow label="Statut paiement" value="Capture apres adjudication" />
            <DetailRow label="Liberation des fonds" value="Apres retrait confirme ou validation admin" />
            <DetailRow label="Anti-sniping" value={`Extension exemple: ${antiSnipingExample.toISOString().slice(11, 16)}`} />
            <ol className="ops-steps detail-steps">
              <li>Caution acheteur verifiee avant participation.</li>
              <li>Paiement gagnant bloque en sequestre interne.</li>
              <li>Bien remis par livraison ou point partenaire.</li>
              <li>Reversement vendeur apres confirmation.</li>
            </ol>
          </article>

          <article className="detail-panel detail-panel-light">
            <SectionIntro eyebrow="Vendeur" title="Identite et documents controles" />
            <DetailRow label="Vendeur" value={auction.seller} />
            <DetailRow label="Ville" value={auction.city} />
            <DetailRow label="Document propriete" value={auction.documentValid ? "Valide" : "A completer"} />
            <DetailRow label="Inspection" value={auction.inspected ? "Effectuee" : "En attente"} />
            <DetailRow label="Retrait / livraison" value={auction.delivery} />
          </article>
        </div>
      </section>
    </PageShell>
  );
}
