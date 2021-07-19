import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { SpiderConfigModule } from '@config/providers/spider';
import { ItemsModule } from '@item/items/items.module';
import { SellersModule } from '@item/sellers/sellers.module';

import { SpiderController } from './provider.controller';
import { SpiderService } from './provider.service';

@Module({
  imports: [HttpModule, SpiderConfigModule, SellersModule, ItemsModule],
  controllers: [SpiderController],
  providers: [SpiderService],
})
export class SpiderModule {}
