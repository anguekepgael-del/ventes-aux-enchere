import assert from "node:assert/strict";
import test from "node:test";
import { AuctionsService } from "../backend/dist/auctions/auctions.service.js";
import { BuyersService } from "../backend/dist/buyers/buyers.service.js";
import { DisputesService } from "../backend/dist/disputes/disputes.service.js";
import { InMemoryMarketplaceStore } from "../backend/dist/common/in-memory-marketplace.store.js";
import { NotificationsService } from "../backend/dist/notifications/notifications.service.js";
import { PaymentsService } from "../backend/dist/payments/payments.service.js";
import { SellersService } from "../backend/dist/sellers/sellers.service.js";
import { UsersService } from "../backend/dist/users/users.service.js";

function createServices() {
  const store = new InMemoryMarketplaceStore();
  return {
    store,
    users: new UsersService(store),
    sellers: new SellersService(store),
    buyers: new BuyersService(store),
    auctions: new AuctionsService(store),
    payments: new PaymentsService(store),
    disputes: new DisputesService(store),
    notifications: new NotificationsService(store),
  };
}

test("backend user, seller and buyer APIs create verified marketplace identities", () => {
  const { buyers, sellers, users } = createServices();
  const user = users.create({
    fullName: "Nadine Mballa",
    email: "nadine@example.cm",
    phone: "+237677111222",
    role: "seller",
    city: "Douala",
  });

  assert.equal(user.identityStatus, "pending");
  users.verify(user.id, { emailVerified: true, phoneVerified: true, identityStatus: "verified" });
  assert.equal(users.get(user.id).phoneVerified, true);

  const seller = sellers.create({ userId: user.id, displayName: "Nadine Shop", type: "company" });
  sellers.review(seller.id, { verificationStatus: "verified", trustBadges: ["Vendeur verifie"] });
  sellers.requestDocuments(seller.id, { documents: ["Facture RCCM"] });
  assert.equal(sellers.get(seller.id).verificationStatus, "verified");
  assert.ok(sellers.get(seller.id).documentsRequested.includes("Facture RCCM"));

  const buyerUser = users.create({
    fullName: "Eric Njoh",
    email: "eric@example.cm",
    phone: "+237699333444",
    role: "buyer",
    city: "Yaounde",
  });
  const buyer = buyers.create({ userId: buyerUser.id });
  assert.equal(buyers.portfolio(buyer.id).buyer.userId, buyerUser.id);
});

test("backend auction API reviews listings and accepts valid bids", () => {
  const { auctions } = createServices();
  const auction = auctions.create({
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
  auctions.review(auction.id, { status: "live", inspected: true, documentValid: true });

  const bid = auctions.placeBid(auction.id, { buyerId: "buyer_demo", amount: 950000 });
  assert.equal(bid.accepted, true);
  assert.equal(bid.minimumNextBid, 1000000);
});

test("backend payment, dispute and notification APIs cover escrow operations", () => {
  const { disputes, notifications, payments } = createServices();
  const payment = payments.create({
    buyerId: "buyer_demo",
    sellerId: "seller_demo",
    auctionId: "auction_demo",
    provider: "orange_money",
    purpose: "deposit",
    amount: 125000,
  });

  payments.updateStatus(payment.id, { status: "escrowed", externalReference: "OM-TEST-001" });
  assert.equal(payments.get(payment.id).externalReference, "OM-TEST-001");
  assert.equal(payments.escrowSummary().escrowed, 125000);

  const dispute = disputes.create({
    auctionId: "auction_demo",
    openedByUserId: "user_buyer_demo",
    reason: "Produit non conforme a la description",
    priority: "high",
  });
  disputes.update(dispute.id, { status: "in_review" });
  assert.equal(disputes.get(dispute.id).status, "in_review");

  const notification = notifications.create({
    userId: "user_buyer_demo",
    channel: "whatsapp",
    subject: "Litige recu",
    body: "Notre equipe support analyse votre dossier.",
  });
  notifications.markSent(notification.id);
  assert.equal(notifications.list("user_buyer_demo")[0].status, "sent");
});
