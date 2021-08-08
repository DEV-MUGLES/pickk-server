import { Module } from '@nestjs/common';

import { OrderItemsModule } from '@order/order-items/order-items.module';

import { SellerOrderItemResolver } from './seller-order-item.resolver';

@Module({
  imports: [OrderItemsModule],
  providers: [SellerOrderItemResolver],
})
export class SellerOrderAdminModule {}
