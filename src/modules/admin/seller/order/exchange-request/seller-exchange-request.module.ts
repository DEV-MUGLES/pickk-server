import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SearchModule } from '@mcommon/search/search.module';
import { ExchangeRequestsModule } from '@order/exchange-requests/exchange-requests.module';
import { ExchangeRequestsRepository } from '@order/exchange-requests/exchange-requests.repository';
import { OrderItemsModule } from '@order/order-items/order-items.module';

import { SellerExchangeRequestResolver } from './seller-exchange-request.resolver';
import { SellerExchangeRequestService } from './seller-exchange-request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExchangeRequestsRepository]),
    ExchangeRequestsModule,
    OrderItemsModule,
    SearchModule,
  ],
  providers: [SellerExchangeRequestResolver, SellerExchangeRequestService],
})
export class SellerExchangeRequestModule {}
