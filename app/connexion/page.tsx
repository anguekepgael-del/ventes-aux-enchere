import { PageShell, SectionIntro } from "@/src/components/site-chrome";

export default function Page() {
  return (
    <PageShell>
      <section className="section-block light route-hero">
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
            <input defaultValue="" placeholder="Code recu par SMS ou WhatsApp" />
          </label>
          <button className="primary-btn full" type="button">
            Valider
          </button>
        </div>
      </section>
    </PageShell>
  );
}
