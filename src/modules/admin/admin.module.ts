import { Module } from '@nestjs/common';
import { RootAdminModule } from './root/root-admin.module';

import { SellerAdminModule } from './seller/seller-admin.module';

@Module({
  imports: [RootAdminModule, SellerAdminModule],
})
export class AdminModule {}
