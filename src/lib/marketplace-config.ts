export const marketplaceRoles = [
  "super_admin",
  "admin",
  "moderator",
  "verification_agent",
  "customer_support",
  "finance",
  "seller",
  "buyer",
] as const;

export const priorityCategories = [
  "Telephones",
  "Ordinateurs",
  "Electromenager",
  "Vehicules",
  "Motos",
  "Meubles",
  "Materiel professionnel",
  "Bijoux",
  "Equipements de bureau",
  "Materiel agricole",
  "Stocks de boutique",
  "Immobilier controle renforce",
] as const;

export const cameroonCities = [
  "Douala",
  "Yaounde",
  "Bafoussam",
  "Garoua",
  "Bamenda",
  "Limbe",
  "Kribi",
  "Ngaoundere",
  "Maroua",
  "Bertoua",
] as const;

export const paymentMethods = [
  {
    id: "orange_money",
    label: "Orange Money",
    settlement: "caution et solde acheteur",
    status: "prioritaire",
  },
  {
    id: "mtn_momo",
    label: "MTN Mobile Money",
    settlement: "caution et solde acheteur",
    status: "prioritaire",
  },
  {
    id: "card",
    label: "Carte bancaire",
    settlement: "Stripe Checkout test",
    status: "configure test",
  },
  {
    id: "bank_transfer",
    label: "Virement bancaire",
    settlement: "montants eleves et entreprises",
    status: "controle manuel",
  },
  {
    id: "manual_admin",
    label: "Paiement manuel valide",
    settlement: "cas support et finance",
    status: "validation admin",
  },
] as const;

export const trustBadges = [
  "Vendeur verifie",
  "Identite confirmee",
  "Bien inspecte",
  "Document valide",
  "Paiement securise",
  "Retrait en point partenaire",
  "Livraison disponible",
] as const;

export const escrowLifecycle = [
  "Caution bloquee avant enchere",
  "Solde gagnant capture apres adjudication",
  "Fonds conserves pendant livraison ou retrait",
  "Validation acheteur et controle support",
  "Commission deduite",
  "Reversement vendeur finance",
] as const;

export const prohibitedGoods = [
  "Biens voles ou sans preuve de propriete",
  "Medicaments et produits reglementes",
  "Armes et equipements dangereux",
  "Faux documents ou contrefacons",
  "Immobilier sans controle juridique renforce",
] as const;

export function getMarketplaceConfig() {
  return {
    locale: "fr-CM",
    currency: "XAF",
    roles: marketplaceRoles,
    categories: priorityCategories,
    cities: cameroonCities,
    paymentMethods,
    trustBadges,
    escrowLifecycle,
    prohibitedGoods,
    commission: {
      defaultRate: 0.075,
      buyerDepositRate: 0.1,
      smallAuctionDeposit: 5000,
    },
  };
}
