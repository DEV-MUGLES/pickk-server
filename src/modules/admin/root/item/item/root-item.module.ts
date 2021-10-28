import { Module } from '@nestjs/common';

import { ItemsModule } from '@item/items/items.module';
import { ProductsModule } from '@item/products/products.module';

import { RootItemResolver } from './root-item.resolver';

@Module({
  imports: [ItemsModule, ProductsModule],
  providers: [RootItemResolver],
})
export class RootItemModule {}
