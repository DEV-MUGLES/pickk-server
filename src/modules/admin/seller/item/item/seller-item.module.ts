import { Module } from '@nestjs/common';

import { ItemsModule } from '@item/items/items.module';
import { ProductsModule } from '@item/products/products.module';

import { SellerItemResolver } from './seller-item.resolver';

@Module({
  imports: [ItemsModule, ProductsModule],
  providers: [SellerItemResolver],
})
export class SellerItemModule {}
