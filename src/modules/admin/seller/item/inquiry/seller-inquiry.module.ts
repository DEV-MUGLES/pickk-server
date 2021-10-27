import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@pickk/nestjs-sqs';

import { SEND_INQUIRY_ANSWERED_ALIMTALK_QUEUE } from '@queue/constants';

import { InquiriesModule } from '@item/inquiries/inquiries.module';
import { InquiriesRepository } from '@item/inquiries/inquiries.repository';
import { SearchModule } from '@mcommon/search/search.module';

import { SendInquiryAnsweredAlimtalkConsumer } from './consumers';
import { SellerInquiryProducer } from './producers';

import { SellerInquiryResolver } from './seller-inquiry.resolver';
import { SellerInquiryService } from './seller-inquiry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InquiriesRepository]),
    InquiriesModule,
    SearchModule,
    SqsModule.registerQueue({
      name: SEND_INQUIRY_ANSWERED_ALIMTALK_QUEUE,
    }),
  ],
  providers: [
    SellerInquiryResolver,
    SellerInquiryService,
    SellerInquiryProducer,
    SendInquiryAnsweredAlimtalkConsumer,
  ],
})
export class SellerInquiryModule {}
