import { Module } from "@nestjs/common";
import { AuctionsModule } from "./auctions/auctions.module.js";
import { BuyersModule } from "./buyers/buyers.module.js";
import { DisputesModule } from "./disputes/disputes.module.js";
import { HealthModule } from "./health/health.module.js";
import { NotificationsModule } from "./notifications/notifications.module.js";
import { PaymentsModule } from "./payments/payments.module.js";
import { SellersModule } from "./sellers/sellers.module.js";
import { UsersModule } from "./users/users.module.js";
import { MarketplaceDataModule } from "./common/marketplace-data.module.js";

@Module({
  imports: [
    MarketplaceDataModule,
    HealthModule,
    UsersModule,
    SellersModule,
    BuyersModule,
    AuctionsModule,
    PaymentsModule,
    DisputesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
