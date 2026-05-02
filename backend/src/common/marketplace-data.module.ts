import { Global, Module } from "@nestjs/common";
import { InMemoryMarketplaceStore } from "./in-memory-marketplace.store.js";

@Global()
@Module({
  providers: [InMemoryMarketplaceStore],
  exports: [InMemoryMarketplaceStore],
})
export class MarketplaceDataModule {}
