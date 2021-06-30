import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsModule } from '@item/items/items.module';
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
    ItemsModule,
    SellersModule,
  ],
  providers: [CouponsResolver, CouponsService],
  controllers: [CouponController],
})
export class CouponsModule {}
