import { PageShell, SectionIntro } from "@/src/components/site-chrome";
import { adminCases } from "@/src/lib/demo-data";

export default function Page() {
  return (
    <PageShell>
      <section className="section-block admin-section route-hero">
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
                        <button className="filter-btn" type="button">
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
    </PageShell>
  );
}
