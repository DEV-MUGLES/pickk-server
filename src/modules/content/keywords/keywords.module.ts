import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { UPDATE_KEYWORD_LIKE_COUNT_QUEUE } from '@queue/constants';

import { SearchModule } from '@mcommon/search/search.module';
import { LikesModule } from '@content/likes/likes.module';
import { FollowsModule } from '@user/follows/follows.module';

import { UpdateKeywordLikeCountConsumer } from './consumers';

import {
  KeywordsRepository,
  KeywordClassesRepository,
} from './keywords.repository';
import { KeywordsResolver } from './keywords.resolver';
import { KeywordsService } from './keywords.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([KeywordsRepository, KeywordClassesRepository]),
    SqsModule.registerQueue({
      name: UPDATE_KEYWORD_LIKE_COUNT_QUEUE,
      type: SqsQueueType.Consumer,
      consumerOptions: { batchSize: 10 },
    }),
    LikesModule,
    FollowsModule,
    forwardRef(() => SearchModule),
  ],
  providers: [
    Logger,
    KeywordsResolver,
    KeywordsService,
    UpdateKeywordLikeCountConsumer,
  ],
  exports: [KeywordsService],
})
export class KeywordsModule {}
