import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsModule } from '@item/items/items.module';

import { InquiriesRepository } from './inquiries.repository';
import { InquiriesResolver } from './inquiries.resolver';
import { InquiriesService } from './inquiries.service';

@Module({
  imports: [TypeOrmModule.forFeature([InquiriesRepository]), ItemsModule],
  providers: [InquiriesResolver, InquiriesService],
  exports: [InquiriesService],
})
export class InquiriesModule {}
