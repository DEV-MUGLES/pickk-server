import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SellersModule } from '@item/sellers/sellers.module';
import { OrderItemsModule } from '@order/order-items/order-items.module';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { OrdersModule } from '@order/orders/orders.module';
import { RefundRequestsModule } from '@order/refund-requests/refund-requests.module';
import { PaymentsModule } from '@payment/payments/payments.module';

import { SellerOrderItemResolver } from './seller-order-item.resolver';
import { SellerOrderItemService } from './seller-order-item.service';
import { SellerRefundRequestResolver } from './seller-refund-request.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItemsRepository]),
    SellersModule,
    OrderItemsModule,
    OrdersModule,
    RefundRequestsModule,
    PaymentsModule,
  ],
  providers: [
    SellerOrderItemResolver,
    SellerRefundRequestResolver,
    SellerOrderItemService,
  ],
})
export class SellerOrderAdminModule {}
