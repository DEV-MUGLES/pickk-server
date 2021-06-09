import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CouponSpecificationsRepository,
  CouponsRepository,
} from './coupons.repository';
import { CouponsResolver } from './coupons.resolver';
import { CouponsService } from './coupons.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CouponsRepository,
      CouponSpecificationsRepository,
    ]),
  ],
  providers: [CouponsResolver, CouponsService],
})
export class CouponsModule {}
