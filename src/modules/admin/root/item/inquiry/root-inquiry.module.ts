import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InquiriesModule } from '@item/inquiries/inquiries.module';
import { InquiriesRepository } from '@item/inquiries/inquiries.repository';
import { SellersModule } from '@item/sellers/sellers.module';

import { RootInquiryResolver } from './root-inquiry.resolver';
import { RootInquiryService } from './root-inquiry.service';

@Module({
  imports: [TypeOrmModule.forFeature([InquiriesRepository]), InquiriesModule, SellersModule],
  providers: [RootInquiryResolver, RootInquiryService],
})
export class RootInquiryModule {}
