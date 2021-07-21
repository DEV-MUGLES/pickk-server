import { ProductsModule } from '@item/products/products.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderSheetsModule } from '@order/order-sheets/order-sheets.module';

import { OrdersRepository } from './orders.repository';
import { OrdersResolver } from './orders.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersRepository]),
    OrderSheetsModule,
    ProductsModule,
  ],
  providers: [OrdersResolver],
})
export class OrdersModule {}
