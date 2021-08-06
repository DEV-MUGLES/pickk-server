import { Module } from '@nestjs/common';

import { SellerSpiderModule } from './seller';

@Module({
  imports: [SellerSpiderModule],
})
export class SpidersModule {}
