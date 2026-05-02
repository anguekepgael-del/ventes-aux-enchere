import Link from "next/link";
import { PageShell, SectionIntro, WorkflowStep } from "@/src/components/site-chrome";
import { faqItems, platformImages } from "@/src/lib/demo-data";
import { paymentMethods, prohibitedGoods, trustBadges } from "@/src/lib/marketplace-config";
import { mediaStyle } from "@/src/lib/visual-style";

export function HowItWorksPage() {
  return (
    <PageShell>
      <section className="section-block light route-hero">
        <SectionIntro eyebrow="Comment ca marche" title="Un parcours encadre de la verification au reversement" />
        <div className="workflow-grid">
          <WorkflowStep index="01" title="Verification">
            Acheteur et vendeur confirment email, telephone OTP et documents selon le niveau de risque.
          </WorkflowStep>
          <WorkflowStep index="02" title="Depot du bien">
            Le vendeur soumet description, medias, preuve de propriete, conditions d'enchere et livraison.
          </WorkflowStep>
          <WorkflowStep index="03" title="Validation admin">
            Moderation, agent de verification et finance controlent le dossier avant publication.
          </WorkflowStep>
          <WorkflowStep index="04" title="Caution et enchere">
            L'acheteur paie la caution requise, puis encherit avec palier minimum et anti-sniping.
          </WorkflowStep>
          <WorkflowStep index="05" title="Sequestre">
            Le paiement gagnant est bloque jusqu'a remise du bien, confirmation ou decision support.
          </WorkflowStep>
          <WorkflowStep index="06" title="Reversement">
            La commission est deduite, la facture est generee et le vendeur est reverse.
          </WorkflowStep>
        </div>
      </section>
    </PageShell>
  );
}

export function FaqPage() {
  return (
    <PageShell>
      <section className="section-block route-hero">
        <SectionIntro eyebrow="Aide" title="Questions frequentes avant de vendre ou encherir" />
        <div className="faq-grid">
          {faqItems.map(([question, answer]) => (
            <article className="faq-card" key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export function ContactPage() {
  return (
    <PageShell>
      <section className="section-block light route-hero">
        <SectionIntro eyebrow="Contact et support" title="Un support visible pour rassurer chaque transaction" />
        <div className="contact-layout">
          <div
            className="wide-media contact-media"
            role="img"
            aria-label="Equipe support client professionnelle"
            style={mediaStyle(platformImages.supportDesk)}
          />
          <div className="auth-card contact-card">
            <label>
              Nom complet
              <input defaultValue="Gael Anguep" />
            </label>
            <label>
              Telephone WhatsApp
              <input defaultValue="+237 699 000 111" />
            </label>
            <label>
              Sujet
              <input defaultValue="Verification vendeur" />
            </label>
            <label>
              Message
              <textarea defaultValue="Bonjour, je souhaite faire valider mon compte vendeur." />
            </label>
            <Link className="primary-btn full" href="https://wa.me/237600000000">
              Contacter le support WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function LegalPage({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <PageShell>
      <section className="section-block light route-hero">
        <SectionIntro eyebrow={eyebrow} title={title} />
        <div className="legal-grid">
          <article className="legal-panel">
            <h3>Verification et responsabilites</h3>
            <p>
              Les utilisateurs doivent fournir des informations exactes. Les vendeurs restent responsables
              de la propriete, de la conformite et des documents transmis.
            </p>
          </article>
          <article className="legal-panel">
            <h3>Paiements et sequestre</h3>
            <p>
              Les cautions et paiements gagnants peuvent etre bloques temporairement avant remboursement,
              deduction ou reversement vendeur selon le statut de la transaction.
            </p>
          </article>
          <article className="legal-panel">
            <h3>Biens interdits</h3>
            <div className="ops-list compact">
              {prohibitedGoods.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
          <article className="legal-panel">
            <h3>Canaux et confidentialite</h3>
            <div className="ops-list">
              {paymentMethods.slice(0, 3).map((method) => (
                <span key={method.id}>
                  <strong>{method.label}</strong>
                  <small>{method.status}</small>
                </span>
              ))}
            </div>
          </article>
        </div>
        <div className="badge-cloud legal-badges">
          {trustBadges.map((badge) => (
            <span className="badge" key={badge}>
              {badge}
            </span>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
