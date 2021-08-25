import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InquiriesRepository } from './inquiries.repository';
import { InquiriesResolver } from './inquiries.resolver';
import { InquiriesService } from './inquiries.service';

@Module({
  imports: [TypeOrmModule.forFeature([InquiriesRepository])],
  providers: [InquiriesResolver, InquiriesService],
  exports: [InquiriesService],
})
export class InquiriesModule {}
