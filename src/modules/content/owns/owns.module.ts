import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@nestjs-packages/sqs';

import { KeywordsModule } from '@content/keywords/keywords.module';
import { UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_QUEUE } from '@queue/constants';

import { UpdateKeywordClassOwningCountCacheConsumer } from './consumers';
import { OwningCountCacheProducer } from './producers';

import { OwnsRepository } from './owns.repository';
import { OwnsResolver } from './owns.resolver';
import { OwnsService } from './owns.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OwnsRepository]),
    KeywordsModule,
    SqsModule.registerQueue({
      name: UPDATE_KEYWORD_CLASS_OWNING_COUNT_CACHE_QUEUE,
    }),
  ],
  providers: [
    OwnsResolver,
    OwnsService,
    OwningCountCacheProducer,
    UpdateKeywordClassOwningCountCacheConsumer,
  ],
})
export class OwnsModule {}
