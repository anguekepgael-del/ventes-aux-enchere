import { PageShell, SectionIntro, WorkflowStep } from "@/src/components/site-chrome";

export default function Page() {
  return (
    <PageShell>
      <section className="section-block light route-hero">
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

      <section className="section-block">
        <SectionIntro eyebrow="Pages legales" title="Cadre de confiance pour le marche camerounais" />
        <div className="workflow-grid">
          <article>
            <span>CGU</span>
            <h3>Regles d'utilisation</h3>
            <p>Roles, responsabilites, verification et conditions de participation.</p>
          </article>
          <article>
            <span>KYC</span>
            <h3>Identite</h3>
            <p>Controle vendeur, acheteur, telephone, email et documents sensibles.</p>
          </article>
          <article>
            <span>DATA</span>
            <h3>Confidentialite</h3>
            <p>Documents stockes securises et acces limite aux agents autorises.</p>
          </article>
          <article>
            <span>RISK</span>
            <h3>Litiges</h3>
            <p>Signalement, mediation, remboursement et blocage des fonds si besoin.</p>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
