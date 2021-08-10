import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExchangeRequestsModule } from '@order/exchange-requests/exchange-requests.module';
import { ExchangeRequestsRepository } from '@order/exchange-requests/exchange-requests.repository';

import { SellerExchangeRequestResolver } from './seller-exchange-request.resolver';
import { SellerExchangeRequestService } from './seller-exchange-request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExchangeRequestsRepository]),
    ExchangeRequestsModule,
  ],
  providers: [SellerExchangeRequestResolver, SellerExchangeRequestService],
})
export class SellerExchangeRequestModule {}
