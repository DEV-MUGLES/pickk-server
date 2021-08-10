import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SellersModule } from '@item/sellers/sellers.module';
import { OrderItemsModule } from '@order/order-items/order-items.module';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';

import { SellerOrderItemResolver } from './seller-order-item.resolver';
import { SellerOrderItemService } from './seller-order-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItemsRepository]),
    OrderItemsModule,
    SellersModule,
  ],
  providers: [SellerOrderItemResolver, SellerOrderItemService],
})
export class SellerOrderAdminModule {}
