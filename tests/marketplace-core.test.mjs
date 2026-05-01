import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateBuyerDeposit,
  calculateCommission,
  canPlaceBid,
  formatXaf,
  getMinimumNextBid,
} from "../src/marketplace-core.mjs";

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
  assert.equal(calculateBuyerDeposit({ startPrice: 120000, rate: 0.1, minimum: 25000 }), 25000);
  assert.equal(calculateBuyerDeposit({ startPrice: 900000, rate: 0.1, minimum: 25000 }), 90000);
});

test("calculates platform commission from final sale price", () => {
  assert.equal(calculateCommission({ finalPrice: 2500000, rate: 0.075 }), 187500);
});
