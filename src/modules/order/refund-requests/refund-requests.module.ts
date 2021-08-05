import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefundRequestsRepository } from './refund-requests.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RefundRequestsRepository])],
})
export class RefundRequestsModule {}
