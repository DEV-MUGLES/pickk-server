import { Module } from '@nestjs/common';

import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [CouponsModule],
})
export class OrderModule {}
