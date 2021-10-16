import { Module } from '@nestjs/common';

import { SellersModule } from '@item/sellers/sellers.module';

import { RootSellerResolver } from './root-seller.resolver';

@Module({
  imports: [SellersModule],
  providers: [RootSellerResolver],
})
export class RootSellerModule {}
