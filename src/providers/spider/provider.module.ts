import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { SpiderConfigModule } from '@config/providers/spider/config.module';
import { ItemImageUrlJobModule } from '@jobs/item-image-url/item-image.job.module';
import { ItemsModule } from '@item/items/items.module';
import { SellersModule } from '@item/sellers/sellers.module';

import { SpiderController } from './provider.controller';
import { SpiderService } from './provider.service';

@Module({
  imports: [
    HttpModule,
    SpiderConfigModule,
    SellersModule,
    ItemsModule,
    ItemImageUrlJobModule,
  ],
  controllers: [SpiderController],
  providers: [SpiderService],
})
export class SpiderModule {}
