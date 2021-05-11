import { Module } from '@nestjs/common';

import { SpiderConfigModule } from '@src/config/providers/spider/config.module';
import { ItemsModule } from '@src/modules/item/items/items.module';
import { SellersModule } from '@src/modules/item/sellers/sellers.module';

import { SpiderController } from './provider.controller';
import { SpiderService } from './provider.service';

@Module({
  imports: [SpiderConfigModule, SellersModule, ItemsModule],
  controllers: [SpiderController],
  providers: [SpiderService],
})
export class SpiderModule {}
