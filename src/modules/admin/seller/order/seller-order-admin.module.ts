import { Module } from '@nestjs/common';

import { SellerOrderAdminResolver } from './seller-order-admin.resolver';

@Module({
  providers: [SellerOrderAdminResolver],
})
export class SellerOrderAdminModule {}
