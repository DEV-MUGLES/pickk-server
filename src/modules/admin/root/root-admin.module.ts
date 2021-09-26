import { Module } from '@nestjs/common';

import { RootInquiryModule } from './item/inquiry/root-inquiry.module';
import { RootOrderItemModule } from './order/order-item/root-order-item.module';

@Module({
  imports: [RootInquiryModule, RootOrderItemModule],
})
export class RootAdminModule {}
