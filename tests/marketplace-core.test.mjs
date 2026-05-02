import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateBuyerDeposit,
  calculateCommission,
  calculateSellerPayout,
  canPlaceBid,
  formatXaf,
  getAntiSnipingEndTime,
  getEscrowDecision,
  getDepositPolicy,
  getMinimumNextBid,
  isValidCameroonMobileMoneyPhone,
  normalizeCameroonPhone,
} from "../src/marketplace-core.mjs";
import { getStripeCardPaymentConfig } from "../src/payment-config.mjs";

test("formats XAF prices with French grouping and FCFA suffix", () => {
  assert.equal(formatXaf(1250000), "1 250 000 FCFA");
});

test("computes the next minimum bid from current price and increment", () => {
  assert.equal(getMinimumNextBid({ currentPrice: 840000, increment: 25000 }), 865000);
});

test("requires verified identity, phone, and paid deposit before bidding", () => {
  const result = canPlaceBid({
    user: { identityVerified: true, phoneVerified: true },
    auction: { currentPrice: 840000, increment: 25000 },
    bidAmount: 865000,
    depositPaid: true,
  });

  assert.deepEqual(result, { allowed: true, reason: "eligible" });
});

test("blocks a bid below the minimum next bid", () => {
  const result = canPlaceBid({
    user: { identityVerified: true, phoneVerified: true },
    auction: { currentPrice: 840000, increment: 25000 },
    bidAmount: 850000,
    depositPaid: true,
  });

  assert.equal(result.allowed, false);
  assert.match(result.reason, /minimum/i);
});

test("calculates buyer deposit with a minimum floor", () => {
  assert.equal(calculateBuyerDeposit({ startPrice: 45000 }), 0);
  assert.equal(calculateBuyerDeposit({ startPrice: 120000 }), 5000);
  assert.equal(calculateBuyerDeposit({ startPrice: 900000 }), 90000);
  assert.equal(calculateBuyerDeposit({ startPrice: 2500000 }), 250000);
});

test("returns deposit policy labels for Cameroon auction thresholds", () => {
  assert.deepEqual(getDepositPolicy({ startPrice: 45000 }), {
    amount: 0,
    required: false,
    status: "optional",
    verification: "standard",
  });
  assert.deepEqual(getDepositPolicy({ startPrice: 2500000 }), {
    amount: 250000,
    required: true,
    status: "blocked",
    verification: "enhanced",
  });
});

test("calculates platform commission from final sale price", () => {
  assert.equal(calculateCommission({ finalPrice: 2500000, rate: 0.075 }), 187500);
});

test("calculates seller payout after commission", () => {
  assert.deepEqual(calculateSellerPayout({ finalPrice: 1000000, commissionRate: 0.075 }), {
    commission: 75000,
    payout: 925000,
  });
});

test("normalizes and validates Cameroon Mobile Money phone numbers", () => {
  assert.equal(normalizeCameroonPhone("+237 699 000 111"), "237699000111");
  assert.equal(isValidCameroonMobileMoneyPhone("+237 699 000 111"), true);
  assert.equal(isValidCameroonMobileMoneyPhone("+237 299 000 111"), false);
});

test("returns escrow release decision from transaction state", () => {
  assert.equal(
    getEscrowDecision({
      paymentCaptured: true,
      buyerConfirmed: true,
      disputeOpen: false,
      adminApproved: true,
    }),
    "releasable",
  );
  assert.equal(
    getEscrowDecision({
      paymentCaptured: true,
      buyerConfirmed: true,
      disputeOpen: true,
      adminApproved: true,
    }),
    "disputed",
  );
});

test("extends auction when a bid arrives inside the anti-sniping window", () => {
  const originalEnd = new Date("2026-05-02T12:00:00.000Z");
  assert.equal(
    getAntiSnipingEndTime({
      auctionEndsAt: originalEnd,
      bidAt: new Date("2026-05-02T11:59:00.000Z"),
    }).toISOString(),
    "2026-05-02T12:03:00.000Z",
  );
  assert.equal(
    getAntiSnipingEndTime({
      auctionEndsAt: originalEnd,
      bidAt: new Date("2026-05-02T11:55:00.000Z"),
    }).toISOString(),
    originalEnd.toISOString(),
  );
});

test("detects Stripe card payment readiness from public and secret keys", () => {
  assert.deepEqual(
    getStripeCardPaymentConfig({
      publishableKey: "pk_test_123",
      secretKey: "",
      currency: "xaf",
    }),
    {
      provider: "stripe",
      mode: "test",
      currency: "xaf",
      publishableKey: "pk_test_123",
      publishableKeyConfigured: true,
      serverCheckoutConfigured: false,
    },
  );

  assert.equal(
    getStripeCardPaymentConfig({
      publishableKey: "pk_live_123",
      secretKey: "sk_live_123",
      currency: "usd",
    }).mode,
    "live",
  );
});
