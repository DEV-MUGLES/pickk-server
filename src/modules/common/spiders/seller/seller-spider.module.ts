import { Module } from '@nestjs/common';

import { SellerSpiderService } from './seller-spider.service';

@Module({
  providers: [SellerSpiderService],
  exports: [SellerSpiderService],
})
export class SellerSpiderModule {}
