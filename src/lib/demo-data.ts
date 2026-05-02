export type DemoAuction = {
  id: string;
  title: string;
  category: string;
  city: string;
  seller: string;
  startPrice: number;
  currentPrice: number;
  increment: number;
  reservePrice: number;
  buyNow: number;
  endsIn: string;
  urgent: boolean;
  inspected: boolean;
  verifiedSeller: boolean;
  documentValid: boolean;
  delivery: string;
  bg: string;
  imageUrl: string;
  imageAlt: string;
};

export const platformImages = {
  sellerDesk:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=88",
  buyerDesk:
    "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1400&q=88",
  operations:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=88",
  adminDesk:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=88",
};

export const demoAuctions: DemoAuction[] = [
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
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=88",
    imageAlt: "Smartphone premium photographie en studio",
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
    imageUrl:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=88",
    imageAlt: "SUV moderne photographie de profil en lumiere naturelle",
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
    imageUrl:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1400&q=88",
    imageAlt: "Materiel agricole et culture professionnelle",
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
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=88",
    imageAlt: "Espace bureau moderne avec ordinateurs et imprimantes",
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
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=88",
    imageAlt: "Bijou en or photographie macro premium",
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
    imageUrl:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1400&q=88",
    imageAlt: "Refrigerateur moderne dans une cuisine premium",
  },
];

export const wizardSteps = [
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

export const adminCases = [
  ["Toyota RAV4 2018", "Bien", "Inspection juridique", "Moyen"],
  ["Kamer Digital SARL", "Vendeur", "Documents valides", "Faible"],
  ["Parure or 18 carats", "Bien", "Certificat a confirmer", "Moyen"],
  ["Litige #L-204", "Litige", "Paiement en sequestre", "Eleve"],
  ["Signalement #S-881", "Signalement", "Annonce suspecte", "Eleve"],
];
