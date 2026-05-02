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

  function calculateBuyerDeposit({ startPrice, rate, minimum }) {
    if (rate !== undefined || minimum !== undefined) {
      return Math.max(Math.round(startPrice * (rate ?? 0.1)), minimum ?? 0);
    }

    return getDepositPolicy({ startPrice }).amount;
  }

  function getDepositPolicy({ startPrice }) {
    if (startPrice < 50000) {
      return {
        amount: 0,
        required: false,
        status: "optional",
        verification: "standard",
      };
    }

    if (startPrice <= 200000) {
      return {
        amount: 5000,
        required: true,
        status: "blocked",
        verification: "standard",
      };
    }

    return {
      amount: Math.round(startPrice * 0.1),
      required: true,
      status: "blocked",
      verification: startPrice > 1000000 ? "enhanced" : "standard",
    };
  }

  function calculateCommission({ finalPrice, rate = 0.075 }) {
    return Math.round(finalPrice * rate);
  }

  function getAntiSnipingEndTime({
    auctionEndsAt,
    bidAt,
    windowMinutes = 2,
    extensionMinutes = 3,
  }) {
    const windowMs = windowMinutes * 60 * 1000;
    const extensionMs = extensionMinutes * 60 * 1000;
    const remainingMs = auctionEndsAt.getTime() - bidAt.getTime();

    if (remainingMs >= 0 && remainingMs <= windowMs) {
      return new Date(auctionEndsAt.getTime() + extensionMs);
    }

    return auctionEndsAt;
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
    getAntiSnipingEndTime,
    getDepositPolicy,
    getMinimumNextBid,
  };
})();
