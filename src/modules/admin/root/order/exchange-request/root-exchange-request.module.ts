import { Module } from '@nestjs/common';

import { SearchModule } from '@mcommon/search/search.module';
import { ExchangeRequestsModule } from '@order/exchange-requests/exchange-requests.module';

import { RootExchangeRequestResolver } from './root-exchange-request.resolver';

@Module({
  imports: [ExchangeRequestsModule, SearchModule],
  providers: [RootExchangeRequestResolver],
})
export class RootExchangeRequestModule {}
