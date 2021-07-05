import { Module } from '@nestjs/common';

import { ProductsModule } from '@item/products/products.module';
import { CouponsModule } from '@order/coupons/coupons.module';
import { PointsModule } from '@order/points/points.module';
import { UsersModule } from '@user/users/users.module';

import { OrderSheetsResolver } from './order-sheets.resolver';

@Module({
  imports: [ProductsModule, CouponsModule, PointsModule, UsersModule],
  providers: [OrderSheetsResolver],
})
export class OrderSheetsModule {}
