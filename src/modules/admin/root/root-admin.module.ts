import { Module } from '@nestjs/common';

import { RootAuthModule } from './auth/root-auth.module';
import { RootInquiryModule } from './item/inquiry/root-inquiry.module';
import { RootItemModule } from './item/item/root-item.module';
import { RootOrderItemModule } from './order/order-item/root-order-item.module';

@Module({
  imports: [
    RootAuthModule,
    RootInquiryModule,
    RootOrderItemModule,
    RootItemModule,
  ],
})
export class RootAdminModule {}
