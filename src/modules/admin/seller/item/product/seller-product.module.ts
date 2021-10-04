import { Module } from '@nestjs/common';

import { ProductsModule } from '@item/products/products.module';
import { SellerProductResolver } from './seller-product.resolver';

@Module({
  imports: [ProductsModule],
  providers: [SellerProductResolver],
})
export class SellerProductModule {}
