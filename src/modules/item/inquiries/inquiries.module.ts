import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@pickk/nestjs-sqs';

import { SEND_INQUIRY_CREATED_SLACK_MESSAGE_QUEUE } from '@queue/constants';

import { ItemsModule } from '@item/items/items.module';
import { UsersModule } from '@user/users/users.module';

import { SendInquiryCreationSlackMessageConsumer } from './consumers';
import { InquiriesProducer } from './producers';

import { InquiriesRepository } from './inquiries.repository';
import { InquiriesResolver } from './inquiries.resolver';
import { InquiriesService } from './inquiries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InquiriesRepository]),
    ItemsModule,
    UsersModule,
    SqsModule.registerQueue({ name: SEND_INQUIRY_CREATED_SLACK_MESSAGE_QUEUE }),
  ],
  providers: [
    InquiriesResolver,
    InquiriesService,
    InquiriesProducer,
    SendInquiryCreationSlackMessageConsumer,
  ],
  exports: [InquiriesService],
})
export class InquiriesModule {}
