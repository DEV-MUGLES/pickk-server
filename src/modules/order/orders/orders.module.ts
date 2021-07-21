import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from '@item/products/products.module';

import { OrdersRepository } from './orders.repository';
import { OrdersResolver } from './orders.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersRepository]), ProductsModule],
  providers: [OrdersResolver],
})
export class OrdersModule {}
