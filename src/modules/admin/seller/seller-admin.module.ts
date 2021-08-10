import { Module } from '@nestjs/common';

import { SellerOrderItemModule } from './order/order-item/seller-order-item.module';
import { SellerRefundRequestModule } from './order/refund-request/seller-refund-request.module';

@Module({
  imports: [SellerOrderItemModule, SellerRefundRequestModule],
})
export class SellerAdminModule {}
