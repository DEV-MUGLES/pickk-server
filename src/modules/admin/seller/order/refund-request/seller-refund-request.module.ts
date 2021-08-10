import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefundRequestsModule } from '@order/refund-requests/refund-requests.module';
import { RefundRequestsRepository } from '@order/refund-requests/refund-requests.repository';

import { SellerRefundRequestResolver } from './seller-refund-request.resolver';
import { SellerRefundRequestService } from './seller-refund-request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefundRequestsRepository]),
    RefundRequestsModule,
  ],
  providers: [SellerRefundRequestResolver, SellerRefundRequestService],
})
export class SellerRefundRequestModule {}
