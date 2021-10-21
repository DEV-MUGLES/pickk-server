import { Module } from '@nestjs/common';

import { RootAuthModule } from './auth/root-auth.module';
import { RootInquiryModule } from './item/inquiry/root-inquiry.module';
import { RootItemModule } from './item/item/root-item.module';
import { RootSellerModule } from './item/seller/root-seller.module';
import { RootOrderItemModule } from './order/order-item/root-order-item.module';
import { RootRefundRequestModule } from './order/refund-request/root-refund-request.module';

@Module({
  imports: [
    RootAuthModule,
    RootInquiryModule,
    RootItemModule,
    RootSellerModule,
    RootOrderItemModule,
    RootRefundRequestModule,
  ],
})
export class RootAdminModule {}
