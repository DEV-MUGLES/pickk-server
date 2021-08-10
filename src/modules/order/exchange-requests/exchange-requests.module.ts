import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExchangeRequestsRepository } from './exchange-requests.repository';
import { ExchangeRequestsService } from './exchange-requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRequestsRepository])],
  providers: [ExchangeRequestsService],
  exports: [ExchangeRequestsService],
})
export class ExchangeRequestsModule {}
