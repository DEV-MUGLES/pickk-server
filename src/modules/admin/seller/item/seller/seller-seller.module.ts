import { Module } from '@nestjs/common';

import { SellersModule } from '@item/sellers/sellers.module';

import { SellerSellerResolver } from './seller-seller.resolver';

@Module({
  imports: [SellersModule],
  providers: [SellerSellerResolver],
})
export class SellerSellerModule {}
