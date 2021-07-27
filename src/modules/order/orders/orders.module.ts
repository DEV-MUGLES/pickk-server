import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartsModule } from '@item/carts/carts.module';
import { ProductsModule } from '@item/products/products.module';
import { CouponsModule } from '@order/coupons/coupons.module';
import { PointsModule } from '@order/points/points.module';
import { UsersModule } from '@user/users/users.module';

import { OrdersCreateResolver } from './orders.create.resolver';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersRepository]),
    CartsModule,
    ProductsModule,
    CouponsModule,
    PointsModule,
    UsersModule,
  ],
  providers: [OrdersCreateResolver, OrdersService],
})
export class OrdersModule {}
