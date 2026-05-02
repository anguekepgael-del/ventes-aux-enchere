"use client";

import { useState } from "react";
import { PageShell, SectionIntro } from "@/src/components/site-chrome";
import { platformImages, wizardSteps } from "@/src/lib/demo-data";
import { mediaStyle } from "@/src/lib/visual-style";

export function SellerPage() {
  const [wizardStep, setWizardStep] = useState(0);
  const [toast, setToast] = useState("");
  const activeStep = wizardSteps[wizardStep];

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  return (
    <PageShell>
      <section className="section-block dashboard-band route-hero">
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
            <div
              className="supporting-media"
              role="img"
              aria-label="Vendeur camerounais preparant un dossier de verification"
              style={mediaStyle(platformImages.sellerDesk)}
            />
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
      <div className={`toast ${toast ? "visible" : ""}`}>{toast}</div>
    </PageShell>
  );
}
