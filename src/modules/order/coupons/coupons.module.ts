import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SellersModule } from '@item/sellers/sellers.module';
import {
  CouponSpecificationsRepository,
  CouponsRepository,
} from './coupons.repository';
import { CouponsResolver } from './coupons.resolver';
import { CouponsService } from './coupons.service';
import { CouponController } from './coupons.controller';

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
