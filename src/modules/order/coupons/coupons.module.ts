import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SellersModule } from '@item/sellers/sellers.module';

import { CouponController } from './coupons.controller';
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
    SellersModule,
  ],
  providers: [CouponsResolver, CouponsService],
  exports: [CouponsService],
  controllers: [CouponController],
})
export class CouponsModule {}
