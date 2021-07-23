import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartsModule } from '@item/carts/carts.module';
import { ProductsModule } from '@item/products/products.module';

import { OrdersRepository } from './orders.repository';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersRepository]),
    CartsModule,
    ProductsModule,
  ],
  providers: [OrdersResolver, OrdersService],
})
export class OrdersModule {}
