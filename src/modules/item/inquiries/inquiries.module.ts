import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@nestjs-packages/sqs';

import {
  SEND_INQUIRY_CREATION_SLACK_MESSAGE_QUEUE,
  SEND_INQUIRY_CREATED_ALIMTALK_QUEUE,
  INDEX_INQUIRY_QUEUE,
  REMOVE_INQUIRY_INDEX_QUEUE,
} from '@queue/constants';

import { SearchModule } from '@mcommon/search/search.module';
import { ItemsModule } from '@item/items/items.module';
import { UsersModule } from '@user/users/users.module';

import { InquiriesConsumers } from './consumers';
import { InquiriesProducer } from './producers';

import {
  InquiriesRepository,
  InquiryAnswersRepository,
} from './inquiries.repository';
import { InquiriesResolver } from './inquiries.resolver';
import { InquiriesService } from './inquiries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InquiriesRepository, InquiryAnswersRepository]),
    ItemsModule,
    forwardRef(() => UsersModule),
    forwardRef(() => SearchModule),
    SqsModule.registerQueue(
      {
        name: SEND_INQUIRY_CREATION_SLACK_MESSAGE_QUEUE,
      },
      {
        name: SEND_INQUIRY_CREATED_ALIMTALK_QUEUE,
      },
      {
        name: INDEX_INQUIRY_QUEUE,
      },
      {
        name: REMOVE_INQUIRY_INDEX_QUEUE,
      }
    ),
  ],
  providers: [
    Logger,
    InquiriesResolver,
    InquiriesService,
    InquiriesProducer,
    ...InquiriesConsumers,
  ],
  exports: [InquiriesService],
})
export class InquiriesModule {}
