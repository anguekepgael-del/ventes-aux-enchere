"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DetailRow, PageShell, SectionIntro } from "@/src/components/site-chrome";
import { demoAuctions } from "@/src/lib/demo-data";
import { visualStyle } from "@/src/lib/visual-style";
import {
  calculateBuyerDeposit,
  calculateCommission,
  canPlaceBid,
  formatXaf,
  getDepositPolicy,
  getMinimumNextBid,
} from "@/src/lib/marketplace-core";

export function CataloguePage() {
  const [auctions, setAuctions] = useState(demoAuctions);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedAuctionId, setSelectedAuctionId] = useState(demoAuctions[0].id);
  const [depositPaid, setDepositPaid] = useState(false);
  const [toast, setToast] = useState("");

  const categories = useMemo(
    () => ["Tous", ...Array.from(new Set(auctions.map((auction) => auction.category)))],
    [auctions],
  );
  const visibleAuctions =
    selectedCategory === "Tous"
      ? auctions
      : auctions.filter((auction) => auction.category === selectedCategory);
  const selectedAuction = auctions.find((auction) => auction.id === selectedAuctionId) ?? auctions[0];
  const minimumBid = getMinimumNextBid(selectedAuction);
  const selectedDepositPolicy = getDepositPolicy({ startPrice: selectedAuction.startPrice });

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
    <PageShell>
      <section className="section-block route-hero">
        <SectionIntro eyebrow="Catalogue" title="Encheres en cours au Cameroun" />
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
      </section>

      <section className="section-block">
        <div className="catalogue-layout">
          <div className="auction-grid">
            {visibleAuctions.map((auction) => (
              <article className="auction-card" key={auction.id}>
                <button
                  className="auction-visual"
                  type="button"
                  aria-label={`${auction.title} - ${auction.imageAlt}`}
                  onClick={() => setSelectedAuctionId(auction.id)}
                  style={visualStyle(auction.bg, auction.imageUrl)}
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
                    <span className={`badge ${auction.urgent ? "alert" : "gold"}`}>{auction.endsIn}</span>
                  </div>
                  <div className="card-footer">
                    <small>
                      {calculateBuyerDeposit({ startPrice: auction.startPrice }) > 0
                        ? `Caution ${formatXaf(calculateBuyerDeposit({ startPrice: auction.startPrice }))}`
                        : "Caution optionnelle"}
                    </small>
                    <Link className="ghost-btn" href={`/catalogue/${auction.id}`}>
                      Detail
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="detail-panel">
            <div
              className="detail-media"
              role="img"
              aria-label={selectedAuction.imageAlt}
              style={visualStyle(selectedAuction.bg, selectedAuction.imageUrl)}
            />
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
                  : selectedDepositPolicy.amount > 0
                    ? formatXaf(selectedDepositPolicy.amount)
                    : "Optionnelle"
              }
            />
            <DetailRow
              label="Verification"
              value={selectedDepositPolicy.verification === "enhanced" ? "Renforcee" : "Standard"}
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
              <input aria-label="Montant de l'enchere" defaultValue={minimumBid} inputMode="numeric" name="bidAmount" />
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
      <div className={`toast ${toast ? "visible" : ""}`}>{toast}</div>
    </PageShell>
  );
}
