import { BuyerCard, PageShell, SectionIntro } from "@/src/components/site-chrome";
import { demoAuctions } from "@/src/lib/demo-data";
import { calculateBuyerDeposit, formatXaf } from "@/src/lib/marketplace-core";

export default function Page() {
  const depositTotal = demoAuctions
    .slice(0, 2)
    .reduce((total, auction) => total + calculateBuyerDeposit({ startPrice: auction.startPrice }), 0);

  return (
    <PageShell>
      <section className="section-block light route-hero">
        <SectionIntro eyebrow="Espace acheteur" title="Suivi des encheres, cautions et messages" />
        <div className="buyer-grid">
          <BuyerCard label="Encheres actives" value="3" detail="dont 1 bientot terminee" />
          <BuyerCard label="Cautions bloquees" value={formatXaf(depositTotal)} detail="remboursables selon resultat" />
          <BuyerCard label="Messagerie" value="4" detail="messages support et vendeur" />
          <BuyerCard alert label="Litiges" value="1" detail="dossier en mediation" />
        </div>
      </section>

      <section className="section-block">
        <SectionIntro eyebrow="Parcours acheteur" title="Participation securisee avant chaque enchere" />
        <div className="workflow-grid">
          <article>
            <span>01</span>
            <h3>Verification OTP</h3>
            <p>Confirmation telephone, email et identite avant participation sensible.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Caution</h3>
            <p>Depot Mobile Money obligatoire pour limiter les faux encherisseurs.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Enchere</h3>
            <p>Palier minimum et prix de reserve controles par le moteur transactionnel.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Retrait</h3>
            <p>Livraison ou point partenaire avec validation avant liberation des fonds.</p>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
