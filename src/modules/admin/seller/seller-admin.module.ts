import { Module } from '@nestjs/common';

import { SellerInquiryModule } from './item/inquiry/seller-inquiry.module';
import { SellerItemModule } from './item/item/seller-item.module';
import { SellerSellerModule } from './item/seller/seller-seller.module';

import { SellerExchangeRequestModule } from './order/exchange-request/seller-exchange-request.module';
import { SellerOrderItemModule } from './order/order-item/seller-order-item.module';
import { SellerRefundRequestModule } from './order/refund-request/seller-refund-request.module';

@Module({
  imports: [
    SellerInquiryModule,
    SellerItemModule,
    SellerSellerModule,

    SellerExchangeRequestModule,
    SellerOrderItemModule,
    SellerRefundRequestModule,
  ],
})
export class SellerAdminModule {}
