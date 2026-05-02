import assert from "node:assert/strict";
import test from "node:test";
import { AuctionsService } from "../backend/dist/auctions/auctions.service.js";
import { BuyersService } from "../backend/dist/buyers/buyers.service.js";
import { CategoriesService } from "../backend/dist/categories/categories.service.js";
import { DisputesService } from "../backend/dist/disputes/disputes.service.js";
import { InMemoryMarketplaceStore } from "../backend/dist/common/in-memory-marketplace.store.js";
import { CitiesService } from "../backend/dist/cities/cities.service.js";
import { DocumentsService } from "../backend/dist/documents/documents.service.js";
import { NotificationsService } from "../backend/dist/notifications/notifications.service.js";
import { PaymentsService } from "../backend/dist/payments/payments.service.js";
import { SellersService } from "../backend/dist/sellers/sellers.service.js";
import { UsersService } from "../backend/dist/users/users.service.js";
import {
  mapAuction,
  mapBuyer,
  mapCategory,
  mapCity,
  mapDispute,
  mapDocument,
  mapNotification,
  mapPayment,
  mapSeller,
  mapUser,
} from "../backend/dist/common/prisma-mappers.js";

function createServices() {
  const store = new InMemoryMarketplaceStore();
  return {
    store,
    users: new UsersService(store),
    sellers: new SellersService(store),
    buyers: new BuyersService(store),
    categories: new CategoriesService(store),
    cities: new CitiesService(store),
    documents: new DocumentsService(store),
    auctions: new AuctionsService(store),
    payments: new PaymentsService(store),
    disputes: new DisputesService(store),
    notifications: new NotificationsService(store),
  };
}

test("backend user, seller and buyer APIs create verified marketplace identities", async () => {
  const { buyers, sellers, users } = createServices();
  const user = await users.create({
    fullName: "Nadine Mballa",
    email: "nadine@example.cm",
    phone: "+237677111222",
    role: "seller",
    city: "Douala",
  });

  assert.equal(user.identityStatus, "pending");
  await users.verify(user.id, { emailVerified: true, phoneVerified: true, identityStatus: "verified" });
  assert.equal((await users.get(user.id)).phoneVerified, true);

  const seller = await sellers.create({ userId: user.id, displayName: "Nadine Shop", type: "company" });
  await sellers.review(seller.id, { verificationStatus: "verified", trustBadges: ["Vendeur verifie"] });
  await sellers.requestDocuments(seller.id, { documents: ["Facture RCCM"] });
  assert.equal((await sellers.get(seller.id)).verificationStatus, "verified");
  assert.ok((await sellers.get(seller.id)).documentsRequested.includes("Facture RCCM"));

  const buyerUser = await users.create({
    fullName: "Eric Njoh",
    email: "eric@example.cm",
    phone: "+237699333444",
    role: "buyer",
    city: "Yaounde",
  });
  const buyer = await buyers.create({ userId: buyerUser.id });
  assert.equal((await buyers.portfolio(buyer.id)).buyer.userId, buyerUser.id);
});

test("backend administration APIs manage categories, Cameroon cities and verification documents", async () => {
  const { categories, cities, documents } = createServices();

  const category = await categories.create({
    name: "Materiel agricole",
    slug: "materiel-agricole",
    riskLevel: "standard",
  });
  await categories.update(category.id, { riskLevel: "controlled", enabled: false });
  assert.equal((await categories.get(category.id)).riskLevel, "controlled");
  assert.equal((await categories.list(false))[0].enabled, false);

  const city = await cities.create({ name: "Bafoussam", region: "Ouest" });
  await cities.update(city.id, { enabled: false });
  assert.equal((await cities.get(city.id)).region, "Ouest");
  assert.equal((await cities.list(false))[0].enabled, false);

  const document = await documents.create({
    userId: "user_seller_demo",
    auctionId: "auction_demo",
    type: "facture_achat",
    fileKey: "documents/facture-achat.pdf",
  });
  await documents.review(document.id, { status: "valid", note: "Document lisible et coherent" });
  assert.equal((await documents.get(document.id)).status, "valid");
  assert.equal((await documents.list("valid"))[0].note, "Document lisible et coherent");
});

test("backend auction API reviews listings and accepts valid bids", async () => {
  const { auctions } = createServices();
  const auction = await auctions.create({
    sellerId: "seller_demo",
    title: "MacBook Pro M3",
    category: "Ordinateurs",
    city: "Douala",
    startPrice: 900000,
    minimumIncrement: 50000,
    reservePrice: 1200000,
    buyNowPrice: 1500000,
  });

  assert.equal(auction.status, "pending_review");
  await auctions.review(auction.id, { status: "live", inspected: true, documentValid: true });

  const bid = await auctions.placeBid(auction.id, { buyerId: "buyer_demo", amount: 950000 });
  assert.equal(bid.accepted, true);
  assert.equal(bid.minimumNextBid, 1000000);
});

test("backend payment, dispute and notification APIs cover escrow operations", async () => {
  const { disputes, notifications, payments } = createServices();
  const payment = await payments.create({
    buyerId: "buyer_demo",
    sellerId: "seller_demo",
    auctionId: "auction_demo",
    provider: "orange_money",
    purpose: "deposit",
    amount: 125000,
  });

  await payments.updateStatus(payment.id, { status: "escrowed", externalReference: "OM-TEST-001" });
  assert.equal((await payments.get(payment.id)).externalReference, "OM-TEST-001");
  assert.equal((await payments.escrowSummary()).escrowed, 125000);

  const dispute = await disputes.create({
    auctionId: "auction_demo",
    openedByUserId: "user_buyer_demo",
    reason: "Produit non conforme a la description",
    priority: "high",
  });
  await disputes.update(dispute.id, { status: "in_review" });
  assert.equal((await disputes.get(dispute.id)).status, "in_review");

  const notification = await notifications.create({
    userId: "user_buyer_demo",
    channel: "whatsapp",
    subject: "Litige recu",
    body: "Notre equipe support analyse votre dossier.",
  });
  await notifications.markSent(notification.id);
  assert.equal((await notifications.list("user_buyer_demo"))[0].status, "sent");
});

test("prisma mappers normalize database records into API contracts", () => {
  const createdAt = new Date("2026-05-02T10:00:00.000Z");
  const user = mapUser({
    id: "user_db",
    fullName: "Grace Muna",
    email: "grace@example.cm",
    phone: "+237677000111",
    passwordHash: null,
    role: "buyer",
    city: "Douala",
    emailVerified: true,
    phoneVerified: false,
    identityStatus: "pending",
    suspended: false,
    lastLoginAt: null,
    createdAt,
    updatedAt: createdAt,
  });

  assert.equal(user.createdAt, "2026-05-02T10:00:00.000Z");
  assert.equal(user.role, "buyer");

  const seller = mapSeller({
    id: "seller_db",
    userId: "user_db",
    displayName: "Grace Boutique",
    type: "company",
    verificationStatus: "verified",
    trustBadges: ["Vendeur verifie"],
    documentsRequested: [],
    payoutAccount: null,
    commissionRate: 0.075,
    createdAt,
    updatedAt: createdAt,
  });
  assert.deepEqual(seller.trustBadges, ["Vendeur verifie"]);

  const auction = mapAuction({
    id: "auction_db",
    sellerId: "seller_db",
    categoryId: null,
    title: "Lot ordinateurs",
    description: null,
    category: "Ordinateurs",
    city: "Yaounde",
    startPrice: 500000,
    currentPrice: 575000,
    minimumIncrement: 25000,
    reservePrice: 650000,
    buyNowPrice: null,
    status: "live",
    inspected: true,
    documentValid: true,
    deliveryMode: null,
    endsAt: createdAt,
    createdAt,
    updatedAt: createdAt,
    bids: [
      {
        id: "bid_db",
        auctionId: "auction_db",
        buyerId: "buyer_db",
        amount: 575000,
        createdAt,
      },
    ],
  });

  assert.equal(auction.buyNowPrice, undefined);
  assert.equal(auction.bids[0].amount, 575000);

  const buyer = mapBuyer({
    id: "buyer_db",
    userId: "user_buyer_db",
    walletBalance: 250000,
    blockedDeposits: 50000,
    activeBids: 3,
    disputesCount: 1,
    createdAt,
    updatedAt: createdAt,
  });
  assert.equal(buyer.walletBalance, 250000);
  assert.equal(buyer.blockedDeposits, 50000);

  const payment = mapPayment({
    id: "payment_db",
    buyerId: "buyer_db",
    sellerId: "seller_db",
    auctionId: "auction_db",
    provider: "orange_money",
    purpose: "deposit",
    amount: 50000,
    status: "escrowed",
    externalReference: "OM-REF-001",
    createdAt,
    updatedAt: createdAt,
  });
  assert.equal(payment.amount, 50000);
  assert.equal(payment.createdAt, "2026-05-02T10:00:00.000Z");

  const dispute = mapDispute({
    id: "dispute_db",
    auctionId: "auction_db",
    openedByUserId: "user_buyer_db",
    reason: "Article non conforme",
    status: "in_review",
    priority: "high",
    resolutionNote: null,
    createdAt,
    updatedAt: createdAt,
  });
  assert.equal(dispute.status, "in_review");
  assert.equal(dispute.priority, "high");

  const notification = mapNotification({
    id: "notification_db",
    userId: "user_buyer_db",
    channel: "whatsapp",
    subject: "Caution validee",
    body: "Votre caution est active.",
    status: "sent",
    createdAt,
    sentAt: createdAt,
  });
  assert.equal(notification.channel, "whatsapp");
  assert.equal(notification.status, "sent");

  const category = mapCategory({
    id: "category_db",
    name: "Telephones",
    slug: "telephones",
    riskLevel: "standard",
    enabled: true,
    createdAt,
    updatedAt: createdAt,
  });
  assert.equal(category.slug, "telephones");

  const city = mapCity({
    id: "city_db",
    name: "Douala",
    region: "Littoral",
    enabled: true,
    createdAt,
    updatedAt: createdAt,
  });
  assert.equal(city.region, "Littoral");

  const document = mapDocument({
    id: "document_db",
    userId: "user_db",
    auctionId: "auction_db",
    type: "cni",
    fileKey: "documents/cni.pdf",
    status: "valid",
    note: "Document valide",
    createdAt,
    updatedAt: createdAt,
  });
  assert.equal(document.status, "valid");
  assert.equal(document.note, "Document valide");
});
