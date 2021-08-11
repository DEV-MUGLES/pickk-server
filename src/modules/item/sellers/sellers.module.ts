import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { SaleStrategyRepository } from '@common/repositories';
import {
  SCRAP_SELLER_ITEMS_QUEUE,
  PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE,
} from '@src/queue/constants';
import { CrawlerProviderModule } from '@providers/crawler/provider.module';
import { ItemsModule } from '@item/items/items.module';

import { Consumers } from './consumers';
import { Producers } from './producers';

import { SellersRepository } from './sellers.repository';
import { SellersResolver } from './sellers.resolver';
import { SellersService } from './sellers.service';
import { SellersCrawlService } from './sellers.crawl.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellersRepository, SaleStrategyRepository]),
    SqsModule.registerQueue(
      {
        name: SCRAP_SELLER_ITEMS_QUEUE,
        consumerOptions: {
          visibilityTimeout: 100,
        },
      },
      {
        name: PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE,
        type: SqsQueueType.Producer,
      }
    ),
    HttpModule,
    CrawlerProviderModule,
    ItemsModule,
  ],
  providers: [
    SellersResolver,
    SellersService,
    SellersCrawlService,
    Logger,
    ...Producers,
    ...Consumers,
  ],
  exports: [SellersService, SellersCrawlService, ...Producers],
})
export class SellersModule {}
