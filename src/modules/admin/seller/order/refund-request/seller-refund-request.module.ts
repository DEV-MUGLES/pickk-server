import { Module } from '@nestjs/common';

import { RefundRequestsModule } from '@order/refund-requests/refund-requests.module';

import { SellerRefundRequestResolver } from './seller-refund-request.resolver';

@Module({
  imports: [RefundRequestsModule],
  providers: [SellerRefundRequestResolver],
})
export class SellerRefundRequestModule {}
