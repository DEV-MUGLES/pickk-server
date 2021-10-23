import { Injectable } from '@nestjs/common';

import { BaseSearchService } from '@common/base.search.service';
import { SearchService } from '@providers/elasticsearch/provider.service';

import { RefundRequest } from '@order/refund-requests/models';
import { RefundRequestsService } from '@order/refund-requests/refund-requests.service';

export type RefundRequestSearchBody = Pick<
  RefundRequest,
  | 'id'
  | 'merchantUid'
  | 'sellerId'
  | 'status'
  | 'isSettled'
  | 'isProcessDelaying'
  | 'confirmedAt'
  | 'pickedAt'
  | 'rejectedAt'
  | 'requestedAt'
  | 'settledAt'
  | 'amount'
  | 'faultOf'
  | 'reason'
  | 'rejectReason'
> & {
  orderBuyerName: string;
  orderBuyerPhoneNumber: string;
  shipmentTrackCode: string;
};

@Injectable()
export class RefundRequestSearchService extends BaseSearchService<
  RefundRequest,
  RefundRequestSearchBody
> {
  name = 'refund-requests_index';

  constructor(
    private readonly refundRequestsService: RefundRequestsService,
    readonly searchService: SearchService
  ) {
    super();
  }

  async getModel(merchantUid: string | number): Promise<RefundRequest> {
    return await this.refundRequestsService.get(merchantUid.toString(), [
      'order',
      'order.buyer',
      'shipment',
    ]);
  }

  toBody(refundRequest: RefundRequest): RefundRequestSearchBody {
    return {
      id: refundRequest.merchantUid,
      merchantUid: refundRequest.merchantUid,
      sellerId: refundRequest.sellerId,
      status: refundRequest.status,
      isSettled: refundRequest.isSettled,
      isProcessDelaying: refundRequest.isProcessDelaying,
      confirmedAt: refundRequest.confirmedAt,
      pickedAt: refundRequest.pickedAt,
      rejectedAt: refundRequest.rejectedAt,
      requestedAt: refundRequest.requestedAt,
      settledAt: refundRequest.settledAt,
      faultOf: refundRequest.faultOf,
      reason: refundRequest.reason,
      rejectReason: refundRequest.rejectReason,
      amount: refundRequest.amount,
      orderBuyerName: refundRequest.order?.buyer?.name,
      orderBuyerPhoneNumber: refundRequest.order?.buyer?.phoneNumber,
      shipmentTrackCode: refundRequest.shipment?.trackCode,
    };
  }
}
