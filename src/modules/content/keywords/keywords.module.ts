import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule, SqsQueueType } from '@pickk/nestjs-sqs';

import { LikesModule } from '@content/likes/likes.module';
import { UPDATE_KEYWORD_LIKE_COUNT_QUEUE } from '@queue/constants';

import { UpdateKeywordLikeCountConsumer } from './consumers';

import {
  KeywordsRepository,
  KeywordClasssRepository,
  KeywordMatchTagsRepository,
} from './keywords.repository';
import { KeywordsResolver } from './keywords.resolver';
import { KeywordsService } from './keywords.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KeywordsRepository,
      KeywordClasssRepository,
      KeywordMatchTagsRepository,
    ]),
    SqsModule.registerQueue({
      name: UPDATE_KEYWORD_LIKE_COUNT_QUEUE,
      type: SqsQueueType.Consumer,
      consumerOptions: { batchSize: 10 },
    }),
    LikesModule,
  ],
  providers: [
    KeywordsResolver,
    KeywordsService,
    UpdateKeywordLikeCountConsumer,
  ],
  exports: [KeywordsService],
})
export class KeywordsModule {}
