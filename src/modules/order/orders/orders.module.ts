import { Module } from '@nestjs/common';

import { ProductsModule } from '@item/products/products.module';
import { OrderSheetsModule } from '@order/order-sheets/order-sheets.module';

import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

@Module({
  imports: [ProductsModule, OrderSheetsModule],
  providers: [OrdersResolver, OrdersService],
})
export class OrdersModule {}
