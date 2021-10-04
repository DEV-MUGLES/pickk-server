import { HttpModule } from '@nestjs/axios';
import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import {
  SCRAP_SELLER_ITEMS_QUEUE,
  PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE,
} from '@queue/constants';
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
    TypeOrmModule.forFeature([SellersRepository]),
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
    forwardRef(() => ItemsModule),
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
