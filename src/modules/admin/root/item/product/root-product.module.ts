import { Module } from '@nestjs/common';

import { ProductsModule } from '@item/products/products.module';

import { RootProductResolver } from './root-product.resolver';

@Module({
  imports: [ProductsModule],
  providers: [RootProductResolver],
})
export class RootProductModule {}
