import { Module } from '@nestjs/common';

import { SellerOrderAdminModule } from './order/seller-order-admin.module';

@Module({
  imports: [SellerOrderAdminModule],
})
export class SellerAdminModule {}
