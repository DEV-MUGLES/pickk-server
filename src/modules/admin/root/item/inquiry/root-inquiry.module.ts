import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SearchModule } from '@mcommon/search/search.module';
import { InquiriesModule } from '@item/inquiries/inquiries.module';
import { InquiriesRepository } from '@item/inquiries/inquiries.repository';

import { RootInquiryResolver } from './root-inquiry.resolver';
import { RootInquiryService } from './root-inquiry.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InquiriesRepository]),
    InquiriesModule,
    SearchModule,
  ],
  providers: [RootInquiryResolver, RootInquiryService],
})
export class RootInquiryModule {}
