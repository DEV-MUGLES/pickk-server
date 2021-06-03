import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CouponSpecificationsRepository,
  CouponsRepository,
} from './coupons.repository';
import { CouponsService } from './coupons.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CouponsRepository,
      CouponSpecificationsRepository,
    ]),
  ],
  providers: [CouponsService],
})
export class CouponsModule {}
