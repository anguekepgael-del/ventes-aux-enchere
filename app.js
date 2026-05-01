const {
  calculateBuyerDeposit,
  calculateCommission,
  canPlaceBid,
  formatXaf,
  getMinimumNextBid,
} = window.MarketplaceCore;

const auctions = [
  {
    id: "phone-01",
    title: "iPhone 14 Pro Max 256 Go",
    category: "Telephones",
    city: "Douala",
    seller: "Kamer Digital SARL",
    startPrice: 650000,
    currentPrice: 840000,
    increment: 25000,
    reservePrice: 900000,
    buyNow: 1180000,
    endsIn: "02:18:44",
    urgent: true,
    inspected: true,
    verifiedSeller: true,
    documentValid: true,
    delivery: "Retrait Akwa ou livraison Douala",
    bg: "linear-gradient(135deg, #1b1b1b, #5f6064 55%, #d98f22)",
  },
  {
    id: "car-01",
    title: "Toyota RAV4 2018 controle technique valide",
    category: "Vehicules",
    city: "Yaounde",
    seller: "Garage Mimboman",
    startPrice: 7800000,
    currentPrice: 8650000,
    increment: 150000,
    reservePrice: 9300000,
    buyNow: 11200000,
    endsIn: "11:05:20",
    urgent: false,
    inspected: true,
    verifiedSeller: true,
    documentValid: true,
    delivery: "Visite sur rendez-vous, transfert admin",
    bg: "linear-gradient(135deg, #101010, #284332 55%, #b9852f)",
  },
  {
    id: "agri-01",
    title: "Lot materiel agricole et pompe d'irrigation",
    category: "Materiel agricole",
    city: "Bafoussam",
    seller: "Cooperative Menoua",
    startPrice: 1250000,
    currentPrice: 1475000,
    increment: 50000,
    reservePrice: 1600000,
    buyNow: 2100000,
    endsIn: "23:40:08",
    urgent: false,
    inspected: true,
    verifiedSeller: true,
    documentValid: false,
    delivery: "Retrait entrepot partenaire",
    bg: "linear-gradient(135deg, #141414, #4d5731 55%, #d98f22)",
  },
  {
    id: "office-01",
    title: "Stock boutique: ordinateurs et imprimantes",
    category: "Stocks de boutique",
    city: "Limbe",
    seller: "Atlantic Office",
    startPrice: 2200000,
    currentPrice: 2540000,
    increment: 75000,
    reservePrice: 2750000,
    buyNow: 3400000,
    endsIn: "05:51:09",
    urgent: true,
    inspected: false,
    verifiedSeller: true,
    documentValid: true,
    delivery: "Livraison disponible",
    bg: "linear-gradient(135deg, #101010, #363637 50%, #cf8a20)",
  },
  {
    id: "jewel-01",
    title: "Parure or 18 carats avec certificat",
    category: "Bijoux",
    city: "Douala",
    seller: "Maison Bessengue",
    startPrice: 980000,
    currentPrice: 1260000,
    increment: 40000,
    reservePrice: 1320000,
    buyNow: 1700000,
    endsIn: "17:12:35",
    urgent: false,
    inspected: true,
    verifiedSeller: true,
    documentValid: true,
    delivery: "Retrait securise point partenaire",
    bg: "linear-gradient(135deg, #070707, #514022 55%, #efb64f)",
  },
  {
    id: "home-01",
    title: "Refrigerateur double porte quasi neuf",
    category: "Electromenager",
    city: "Garoua",
    seller: "Depot Nord",
    startPrice: 280000,
    currentPrice: 345000,
    increment: 15000,
    reservePrice: 390000,
    buyNow: 520000,
    endsIn: "31:22:11",
    urgent: false,
    inspected: true,
    verifiedSeller: false,
    documentValid: true,
    delivery: "Retrait ou transport local",
    bg: "linear-gradient(135deg, #171717, #4e4f52 50%, #d98f22)",
  },
];

const adminCases = [
  ["Toyota RAV4 2018", "Bien", "Inspection juridique", "Moyen"],
  ["Kamer Digital SARL", "Vendeur", "Documents valides", "Faible"],
  ["Parure or 18 carats", "Bien", "Certificat a confirmer", "Moyen"],
  ["Litige #L-204", "Litige", "Paiement en sequestre", "Eleve"],
  ["Signalement #S-881", "Signalement", "Annonce suspecte", "Eleve"],
];

let selectedCategory = "Tous";
let selectedAuctionId = auctions[0].id;
let depositPaid = false;
let wizardStep = 0;
let language = "fr";

const user = { identityVerified: true, phoneVerified: true };
const categories = ["Tous", ...new Set(auctions.map((auction) => auction.category))];
const wizardSteps = [
  {
    label: "Bien",
    title: "Informations du bien",
    fields: [
      ["Titre", "iPhone 14 Pro Max 256 Go"],
      ["Categorie", "Telephones"],
      ["Ville", "Douala"],
      ["Etat", "Tres bon"],
    ],
  },
  {
    label: "Prix",
    title: "Prix et conditions d'enchere",
    fields: [
      ["Prix de depart", "650000"],
      ["Palier minimum", "25000"],
      ["Prix de reserve", "900000"],
      ["Achat immediat", "1180000"],
    ],
  },
  {
    label: "Documents",
    title: "Verification et documents",
    fields: [
      ["Piece vendeur", "CNI validee"],
      ["Preuve de propriete", "Facture PDF"],
      ["Inspection", "Agence Douala"],
      ["Photos", "8 images"],
    ],
  },
  {
    label: "Validation",
    title: "Soumission administrative",
    fields: [
      ["Commission estimee", "7.5%"],
      ["Mode retrait", "Point partenaire"],
      ["Paiement", "Sequestre interne"],
      ["Statut", "Pret pour validation"],
    ],
  },
];

const $ = (selector) => document.querySelector(selector);

function selectedAuction() {
  return auctions.find((auction) => auction.id === selectedAuctionId) ?? auctions[0];
}

function renderHero() {
  const auction = auctions[0];
  $("#heroCountdown").textContent = auction.endsIn;
  $("#heroDeposit").textContent = formatXaf(calculateBuyerDeposit({ startPrice: auction.startPrice }));
  $("#heroAuction").innerHTML = `
    <div class="auction-visual" style="--visual-bg: ${auction.bg}">
      <div class="badge-row">
        <span class="badge">Vendeur verifie</span>
        <span class="badge gold">Bien inspecte</span>
      </div>
      <strong>${auction.title}</strong>
      <span>${auction.city} - ${auction.seller}</span>
    </div>
    <div class="auction-body">
      <div class="auction-meta">
        <div class="price-stack"><small>Prix actuel</small><strong>${formatXaf(auction.currentPrice)}</strong></div>
        <span class="badge alert">Bientot termine</span>
      </div>
    </div>
  `;
}

function renderFilters() {
  $("#categoryFilters").innerHTML = categories
    .map((category) => `<button class="filter-btn ${category === selectedCategory ? "active" : ""}" type="button" data-category="${category}">${category}</button>`)
    .join("");
}

function renderAuctionGrid() {
  const visibleAuctions = selectedCategory === "Tous" ? auctions : auctions.filter((auction) => auction.category === selectedCategory);
  $("#auctionGrid").innerHTML = visibleAuctions
    .map((auction) => {
      const deposit = calculateBuyerDeposit({ startPrice: auction.startPrice });
      return `
        <article class="auction-card">
          <button class="auction-visual" type="button" data-select-auction="${auction.id}" style="--visual-bg: ${auction.bg}">
            <div class="badge-row">
              ${auction.verifiedSeller ? '<span class="badge">Vendeur verifie</span>' : '<span class="badge alert">Verification en cours</span>'}
              ${auction.inspected ? '<span class="badge gold">Bien inspecte</span>' : '<span class="badge alert">Inspection requise</span>'}
            </div>
            <strong>${auction.title}</strong><span>${auction.city}</span>
          </button>
          <div class="auction-body">
            <div class="auction-meta">
              <div class="price-stack"><small>Prix actuel</small><strong>${formatXaf(auction.currentPrice)}</strong></div>
              <span class="badge ${auction.urgent ? "alert" : "gold"}">${auction.endsIn}</span>
            </div>
            <div class="card-footer"><small>Caution ${formatXaf(deposit)}</small><button class="ghost-btn" type="button" data-select-auction="${auction.id}">Detail</button></div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderAuctionDetail() {
  const auction = selectedAuction();
  const minimumBid = getMinimumNextBid(auction);
  const deposit = calculateBuyerDeposit({ startPrice: auction.startPrice });
  const commission = calculateCommission({ finalPrice: auction.currentPrice });
  $("#auctionDetail").innerHTML = `
    <p class="eyebrow">Dossier verifie</p>
    <h3>${auction.title}</h3>
    <p>${auction.city} - ${auction.delivery}</p>
    <div class="badge-row">
      ${auction.verifiedSeller ? '<span class="badge">Vendeur verifie</span>' : '<span class="badge alert">Vendeur a verifier</span>'}
      ${auction.documentValid ? '<span class="badge">Document valide</span>' : '<span class="badge alert">Document demande</span>'}
      <span class="badge gold">Paiement securise</span>
    </div>
    <div class="detail-row"><small>Prix actuel</small><strong>${formatXaf(auction.currentPrice)}</strong></div>
    <div class="detail-row"><small>Palier minimum</small><strong>${formatXaf(auction.increment)}</strong></div>
    <div class="detail-row"><small>Prochaine enchere</small><strong>${formatXaf(minimumBid)}</strong></div>
    <div class="detail-row"><small>Prix de reserve</small><strong>${formatXaf(auction.reservePrice)}</strong></div>
    <div class="detail-row"><small>Achat immediat</small><strong>${formatXaf(auction.buyNow)}</strong></div>
    <div class="detail-row"><small>Caution</small><strong>${depositPaid ? "Payee" : formatXaf(deposit)}</strong></div>
    <div class="detail-row"><small>Commission estimee</small><strong>${formatXaf(commission)}</strong></div>
    <div class="bid-control"><input id="bidAmount" inputmode="numeric" value="${minimumBid}" aria-label="Montant de l'enchere" /><button class="primary-btn" id="placeBidButton" type="button">Encherir</button></div>
    <div class="detail-actions"><button class="security-btn" id="payDepositButton" type="button">${depositPaid ? "Caution validee" : "Payer caution"}</button><button class="secondary-btn" id="buyNowButton" type="button">Achat immediat</button></div>
  `;
}

function renderWizard() {
  const active = wizardSteps[wizardStep];
  $("#sellerWizard").innerHTML = `
    <div class="step-tabs">
      ${wizardSteps.map((step, index) => `<button type="button" class="${index === wizardStep ? "active" : ""}" data-wizard-step="${index}">${index + 1}. ${step.label}</button>`).join("")}
    </div>
    <h3>${active.title}</h3>
    <div class="wizard-fields">
      ${active.fields.map(([label, value]) => `<label>${label}<input value="${value}" /></label>`).join("")}
    </div>
    <div class="card-footer" style="margin-top:18px"><span class="badge gold">Validation administrative obligatoire</span><button class="primary-btn" type="button" id="nextWizardStep">${wizardStep === wizardSteps.length - 1 ? "Soumettre" : "Continuer"}</button></div>
  `;
}

function renderAdminRows() {
  $("#adminRows").innerHTML = adminCases
    .map(([name, type, status, risk]) => `<tr><td><strong>${name}</strong></td><td>${type}</td><td>${status}</td><td><span class="badge ${risk === "Eleve" ? "alert" : risk === "Moyen" ? "gold" : ""}">${risk}</span></td><td><button class="filter-btn" type="button" data-admin-action="${name}">Traiter</button></td></tr>`)
    .join("");
}

function renderBuyerStats() {
  const depositTotal = auctions.slice(0, 2).reduce((total, auction) => total + calculateBuyerDeposit({ startPrice: auction.startPrice }), 0);
  $("#buyerActiveCount").textContent = String(auctions.filter((auction) => auction.urgent).length + 1);
  $("#buyerDepositTotal").textContent = formatXaf(depositTotal);
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.append(node);
  requestAnimationFrame(() => node.classList.add("visible"));
  window.setTimeout(() => {
    node.classList.remove("visible");
    window.setTimeout(() => node.remove(), 220);
  }, 2600);
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const categoryButton = event.target.closest("[data-category]");
    if (categoryButton) {
      selectedCategory = categoryButton.dataset.category;
      renderFilters();
      renderAuctionGrid();
      return;
    }
    const auctionButton = event.target.closest("[data-select-auction]");
    if (auctionButton) {
      selectedAuctionId = auctionButton.dataset.selectAuction;
      renderAuctionDetail();
      $("#auctionDetail").scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }
    const wizardButton = event.target.closest("[data-wizard-step]");
    if (wizardButton) {
      wizardStep = Number(wizardButton.dataset.wizardStep);
      renderWizard();
      return;
    }
    const adminButton = event.target.closest("[data-admin-action]");
    if (adminButton) {
      toast(`Dossier ouvert: ${adminButton.dataset.adminAction}`);
      return;
    }
    if (event.target.closest("[data-open-auth]")) {
      $("#authDialog").showModal();
      return;
    }
    if (event.target.id === "languageToggle") {
      language = language === "fr" ? "en" : "fr";
      event.target.textContent = language.toUpperCase();
      toast(language === "fr" ? "Interface en francais" : "English interface preview");
      return;
    }
    if (event.target.id === "heroDepositButton" || event.target.id === "payDepositButton") {
      depositPaid = true;
      renderAuctionDetail();
      toast("Caution validee via Mobile Money. Vous pouvez encherir.");
      return;
    }
    if (event.target.id === "placeBidButton") {
      const auction = selectedAuction();
      const bidAmount = Number($("#bidAmount").value);
      const result = canPlaceBid({ user, auction, bidAmount, depositPaid });
      if (!result.allowed) {
        toast(`Enchere bloquee: ${result.reason}`);
        return;
      }
      auction.currentPrice = bidAmount;
      renderHero();
      renderAuctionGrid();
      renderAuctionDetail();
      toast(`Enchere acceptee a ${formatXaf(bidAmount)}.`);
      return;
    }
    if (event.target.id === "buyNowButton") {
      toast("Achat immediat initie: paiement bloque avant reversement vendeur.");
      return;
    }
    if (event.target.id === "nextWizardStep") {
      if (wizardStep === wizardSteps.length - 1) toast("Bien soumis au controle administratif.");
      else {
        wizardStep += 1;
        renderWizard();
      }
    }
  });
}

function init() {
  renderHero();
  renderFilters();
  renderAuctionGrid();
  renderAuctionDetail();
  renderWizard();
  renderAdminRows();
  renderBuyerStats();
  bindEvents();
}

init();
