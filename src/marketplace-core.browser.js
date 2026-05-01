(function () {
  function formatXaf(amount) {
    const grouped = Math.round(amount)
      .toLocaleString("fr-FR")
      .replace(/\u202f/g, " ");
    return `${grouped} FCFA`;
  }

  function getMinimumNextBid({ currentPrice, increment }) {
    return currentPrice + increment;
  }

  function calculateBuyerDeposit({ startPrice, rate = 0.1, minimum = 25000 }) {
    return Math.max(Math.round(startPrice * rate), minimum);
  }

  function calculateCommission({ finalPrice, rate = 0.075 }) {
    return Math.round(finalPrice * rate);
  }

  function canPlaceBid({ user, auction, bidAmount, depositPaid }) {
    if (!user?.identityVerified) {
      return { allowed: false, reason: "identity verification required" };
    }

    if (!user?.phoneVerified) {
      return { allowed: false, reason: "phone verification required" };
    }

    if (!depositPaid) {
      return { allowed: false, reason: "deposit required before bidding" };
    }

    const minimumBid = getMinimumNextBid(auction);
    if (bidAmount < minimumBid) {
      return { allowed: false, reason: `minimum bid is ${formatXaf(minimumBid)}` };
    }

    return { allowed: true, reason: "eligible" };
  }

  window.MarketplaceCore = {
    calculateBuyerDeposit,
    calculateCommission,
    canPlaceBid,
    formatXaf,
    getMinimumNextBid,
  };
})();
