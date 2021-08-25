import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InquiriesModule } from '@item/inquiries/inquiries.module';
import { InquiriesRepository } from '@item/inquiries/inquiries.repository';

import { SellerInquiryResolver } from './seller-inquiry.resolver';
import { SellerInquiryService } from './seller-inquiry.service';

@Module({
  imports: [TypeOrmModule.forFeature([InquiriesRepository]), InquiriesModule],
  providers: [SellerInquiryResolver, SellerInquiryService],
})
export class SellerInquiryModule {}
