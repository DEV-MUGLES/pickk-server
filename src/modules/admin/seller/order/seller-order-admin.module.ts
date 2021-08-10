import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItemsModule } from '@order/order-items/order-items.module';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';

import { SellerOrderItemResolver } from './seller-order-item.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemsRepository]), OrderItemsModule],
  providers: [SellerOrderItemResolver],
})
export class SellerOrderAdminModule {}
