import { Module } from '@nestjs/common';

import { CouponsModule } from './coupons/coupons.module';
import { PointsModule } from './points/points.module';

@Module({
  imports: [CouponsModule, PointsModule],
})
export class OrderModule {}
