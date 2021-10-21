import { Module } from '@nestjs/common';

import { SearchModule } from '@mcommon/search/search.module';
import { RefundRequestsModule } from '@order/refund-requests/refund-requests.module';

import { RootRefundRequestResolver } from './root-refund-request.resolver';

@Module({
  imports: [RefundRequestsModule, SearchModule],
  providers: [RootRefundRequestResolver],
})
export class RootRefundRequestModule {}
