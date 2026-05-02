"use client";

import Link from "next/link";
import { useState } from "react";
import { PageShell, SectionIntro } from "@/src/components/site-chrome";

type AuthMode = "login" | "register" | "otp" | "forgot";

const verificationSteps = [
  ["Email", "Lien de confirmation obligatoire avant depot ou enchere."],
  ["Telephone OTP", "Code SMS ou WhatsApp pour limiter les faux comptes."],
  ["Identite", "CNI, passeport ou RCCM selon le type de compte."],
  ["2FA admin", "Double facteur requis pour finance, support et moderation."],
];

const securitySignals = [
  "HTTPS obligatoire",
  "Journalisation des connexions sensibles",
  "Controle anti-fraude par role",
  "Blocage temporaire apres tentatives suspectes",
];

function AuthHero({ mode }: { mode: AuthMode }) {
  const titleByMode = {
    login: "Connexion securisee avec OTP",
    register: "Creation de compte verifie",
    otp: "Verification telephone et email",
    forgot: "Recuperation de compte",
  };

  return (
    <section className="section-block light route-hero auth-route">
      <SectionIntro eyebrow="Acces securise" title={titleByMode[mode]} />
      <div className="auth-layout">
        <AuthForm mode={mode} />
        <aside className="auth-assurance-panel" aria-label="Garanties de securite">
          <span className="badge gold">Plateforme camerounaise verifiee</span>
          <h3>La confiance commence avant la premiere enchere.</h3>
          <p>
            Les comptes acheteurs, vendeurs et administrateurs passent par des controles
            adaptes au risque : OTP, documents, badges, historique et surveillance.
          </p>
          <div className="auth-step-list">
            {verificationSteps.map(([title, detail]) => (
              <article key={title}>
                <strong>{title}</strong>
                <span>{detail}</span>
              </article>
            ))}
          </div>
          <div className="auth-security-strip">
            {securitySignals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function AuthForm({ mode }: { mode: AuthMode }) {
  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer");
  const [otpChannel, setOtpChannel] = useState<"sms" | "whatsapp">("whatsapp");
  const [message, setMessage] = useState("");

  function submit(label: string) {
    setMessage(label);
    window.setTimeout(() => setMessage(""), 2800);
  }

  if (mode === "register") {
    return (
      <div className="auth-card auth-product-card">
        <div className="auth-tabs" aria-label="Type de compte">
          <button
            className={accountType === "buyer" ? "active" : ""}
            type="button"
            onClick={() => setAccountType("buyer")}
          >
            Acheteur
          </button>
          <button
            className={accountType === "seller" ? "active" : ""}
            type="button"
            onClick={() => setAccountType("seller")}
          >
            Vendeur
          </button>
        </div>
        <label>
          Nom complet
          <input defaultValue="Jean Fotso" />
        </label>
        <label>
          Email
          <input defaultValue="jean@exemple.cm" type="email" />
        </label>
        <label>
          Telephone Mobile Money
          <input defaultValue="+237 699 000 111" inputMode="tel" />
        </label>
        {accountType === "seller" ? (
          <>
            <label>
              Type vendeur
              <select defaultValue="particulier">
                <option value="particulier">Particulier</option>
                <option value="entreprise">Entreprise / boutique</option>
                <option value="professionnel">Professionnel certifie</option>
              </select>
            </label>
            <label>
              Document principal
              <select defaultValue="cni">
                <option value="cni">CNI ou passeport</option>
                <option value="rccm">RCCM entreprise</option>
                <option value="facture">Facture ou preuve de propriete</option>
              </select>
            </label>
          </>
        ) : (
          <label>
            Ville principale
            <select defaultValue="Douala">
              <option>Douala</option>
              <option>Yaounde</option>
              <option>Bafoussam</option>
              <option>Garoua</option>
            </select>
          </label>
        )}
        <label>
          Mot de passe
          <input defaultValue="cameroon-auction" type="password" />
        </label>
        <button className="primary-btn full" type="button" onClick={() => submit("Compte cree. Verification OTP envoyee.")}>
          Creer le compte
        </button>
        <p className="auth-note">
          Deja inscrit ? <Link href="/auth/connexion">Se connecter</Link>
        </p>
        <AuthMessage message={message} />
      </div>
    );
  }

  if (mode === "otp") {
    return (
      <div className="auth-card auth-product-card">
        <div className="auth-tabs" aria-label="Canal OTP">
          <button
            className={otpChannel === "whatsapp" ? "active" : ""}
            type="button"
            onClick={() => setOtpChannel("whatsapp")}
          >
            WhatsApp
          </button>
          <button className={otpChannel === "sms" ? "active" : ""} type="button" onClick={() => setOtpChannel("sms")}>
            SMS
          </button>
        </div>
        <label>
          Telephone
          <input defaultValue="+237 699 000 111" inputMode="tel" />
        </label>
        <label>
          Code OTP
          <input defaultValue="" inputMode="numeric" placeholder="6 chiffres" />
        </label>
        <div className="auth-inline-actions">
          <button className="secondary-btn" type="button" onClick={() => submit(`Code renvoye par ${otpChannel}.`)}>
            Renvoyer
          </button>
          <button className="primary-btn" type="button" onClick={() => submit("Telephone verifie avec succes.")}>
            Verifier
          </button>
        </div>
        <AuthMessage message={message} />
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <div className="auth-card auth-product-card">
        <label>
          Email ou telephone
          <input defaultValue="acheteur@enchere.cm" />
        </label>
        <label>
          Canal de recuperation
          <select defaultValue="email">
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="sms">SMS</option>
          </select>
        </label>
        <button className="primary-btn full" type="button" onClick={() => submit("Lien de recuperation envoye.")}>
          Envoyer le lien securise
        </button>
        <p className="auth-note">
          Retour a la <Link href="/auth/connexion">connexion</Link>
        </p>
        <AuthMessage message={message} />
      </div>
    );
  }

  return (
    <div className="auth-card auth-product-card">
      <label>
        Email ou telephone
        <input defaultValue="acheteur@enchere.cm" />
      </label>
      <label>
        Mot de passe
        <input defaultValue="cameroon-auction" type="password" />
      </label>
      <label>
        Code OTP
        <input defaultValue="" inputMode="numeric" placeholder="Code recu par SMS ou WhatsApp" />
      </label>
      <button className="primary-btn full" type="button" onClick={() => submit("Connexion validee. Session securisee.")}>
        Se connecter
      </button>
      <div className="auth-link-row">
        <Link href="/auth/inscription">Creer un compte</Link>
        <Link href="/auth/mot-de-passe-oublie">Mot de passe oublie</Link>
      </div>
      <AuthMessage message={message} />
    </div>
  );
}

function AuthMessage({ message }: { message: string }) {
  return <div className={`auth-message ${message ? "visible" : ""}`}>{message}</div>;
}

export function LoginPage() {
  return (
    <PageShell>
      <AuthHero mode="login" />
    </PageShell>
  );
}

export function RegisterPage() {
  return (
    <PageShell>
      <AuthHero mode="register" />
    </PageShell>
  );
}

export function OtpPage() {
  return (
    <PageShell>
      <AuthHero mode="otp" />
    </PageShell>
  );
}

export function ForgotPasswordPage() {
  return (
    <PageShell>
      <AuthHero mode="forgot" />
    </PageShell>
  );
}
