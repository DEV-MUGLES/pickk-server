import { Module } from '@nestjs/common';

import { ExchangeRequestsModule } from '@order/exchange-requests/exchange-requests.module';

import { SellerExchangeRequestResolver } from './seller-exchange-request.resolver';

@Module({
  imports: [ExchangeRequestsModule],
  providers: [SellerExchangeRequestResolver],
})
export class SellerExchangeRequestModule {}
