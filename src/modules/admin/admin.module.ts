import { Module } from '@nestjs/common';

import { SellerAdminModule } from './seller/seller-admin.module';

@Module({
  imports: [SellerAdminModule],
})
export class AdminModule {}
