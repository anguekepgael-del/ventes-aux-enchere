import { DetailRow, PageShell, SectionIntro } from "@/src/components/site-chrome";
import { demoAuctions } from "@/src/lib/demo-data";
import {
  cameroonCities,
  escrowLifecycle,
  paymentMethods,
  prohibitedGoods,
  trustBadges,
} from "@/src/lib/marketplace-config";
import {
  calculateBuyerDeposit,
  calculateSellerPayout,
  formatXaf,
  getEscrowDecision,
} from "@/src/lib/marketplace-core";

export default function Page() {
  const selectedAuction = demoAuctions[0];
  const sellerSettlement = calculateSellerPayout({ finalPrice: selectedAuction.currentPrice });
  const escrowDecision = getEscrowDecision({
    paymentCaptured: true,
    buyerConfirmed: false,
    disputeOpen: false,
    adminApproved: false,
  });

  return (
    <PageShell>
      <section className="section-block operations-section route-hero">
        <SectionIntro
          eyebrow="Operations transactionnelles"
          title="Paiements, sequestre, villes, badges et risques sous controle"
        />
        <div className="operations-grid">
          <article className="ops-panel featured">
            <div className="ops-panel-header">
              <span className="badge gold">Mobile Money ready</span>
              <strong>Caution en attente</strong>
            </div>
            <DetailRow
              label="Montant caution"
              value={formatXaf(calculateBuyerDeposit({ startPrice: selectedAuction.startPrice }))}
            />
            <DetailRow label="Etat sequestre" value={escrowDecision} />
            <DetailRow label="Commission plateforme" value={formatXaf(sellerSettlement.commission)} />
            <DetailRow label="Reversement vendeur" value={formatXaf(sellerSettlement.payout)} />
          </article>

          <article className="ops-panel">
            <h3>Moyens de paiement</h3>
            <div className="ops-list">
              {paymentMethods.map((method) => (
                <span key={method.id}>
                  <strong>{method.label}</strong>
                  <small>
                    {method.settlement} - {method.status}
                  </small>
                </span>
              ))}
            </div>
          </article>

          <article className="ops-panel">
            <h3>Cycle sequestre</h3>
            <ol className="ops-steps">
              {escrowLifecycle.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <article className="ops-panel">
            <h3>Confiance visible</h3>
            <div className="badge-cloud">
              {trustBadges.map((badge) => (
                <span className="badge" key={badge}>
                  {badge}
                </span>
              ))}
            </div>
          </article>

          <article className="ops-panel">
            <h3>Villes couvertes</h3>
            <div className="city-cloud">
              {cameroonCities.map((city) => (
                <span key={city}>{city}</span>
              ))}
            </div>
          </article>

          <article className="ops-panel alert-surface">
            <h3>Biens interdits</h3>
            <div className="ops-list compact">
              {prohibitedGoods.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
