import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { SaleStrategyRepository } from '@common/repositories';
import { UPDATE_SELLER_ITEMS_QUEUE } from '@src/queue/constants';
import { CrawlerProviderModule } from '@providers/crawler/provider.module';
import { ItemsModule } from '@item/items/items.module';

import { Producers } from './producers';

import { SellersRepository } from './sellers.repository';
import { SellersResolver } from './sellers.resolver';
import { SellersService } from './sellers.service';
import { SellersCrawlService } from './sellers.crawl.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellersRepository, SaleStrategyRepository]),
    SqsModule.registerQueue({
      name: UPDATE_SELLER_ITEMS_QUEUE,
      type: SqsQueueType.Producer,
    }),
    HttpModule,
    CrawlerProviderModule,
    ItemsModule,
  ],
  providers: [
    SellersResolver,
    SellersService,
    SellersCrawlService,
    ...Producers,
  ],
  exports: [SellersService, SellersCrawlService, ...Producers],
})
export class SellersModule {}
