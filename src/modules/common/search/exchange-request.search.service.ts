import { Injectable } from '@nestjs/common';

import { BaseSearchService } from '@common/base.search.service';
import { SearchService } from '@providers/elasticsearch/provider.service';

import { ExchangeRequest } from '@order/exchange-requests/models';
import { ExchangeRequestsService } from '@order/exchange-requests/exchange-requests.service';

export type ExchangeRequestSearchBody = Pick<
  ExchangeRequest,
  | 'id'
  | 'merchantUid'
  | 'sellerId'
  | 'productId'
  | 'status'
  | 'requestedAt'
  | 'faultOf'
  | 'reason'
  | 'rejectReason'
  | 'productVariantName'
  | 'pickedAt'
  | 'reshippingAt'
  | 'reshippedAt'
  | 'rejectedAt'
  | 'convertedAt'
  | 'isSettled'
  | 'settledAt'
  | 'isProcessDelaying'
> & {
  orderBuyerName: string;
  orderBuyerPhoneNumber: string;
  pickShipmentTrackCode: string;
  reShipmentTrackCode: string;
};

@Injectable()
export class ExchangeRequestSearchService extends BaseSearchService<
  ExchangeRequest,
  ExchangeRequestSearchBody
> {
  name = 'exchange-requests_index';

  constructor(
    private readonly exchangeRequestsService: ExchangeRequestsService,
    readonly searchService: SearchService
  ) {
    super();
  }

  async getModel(merchantUid: string | number): Promise<ExchangeRequest> {
    return await this.exchangeRequestsService.get(merchantUid.toString(), [
      'orderItem',
      'orderItem.order',
      'orderItem.order.buyer',
      'reShipment',
      'pickShipment',
    ]);
  }

  toBody(exchangeRequest: ExchangeRequest): ExchangeRequestSearchBody {
    return {
      id: exchangeRequest.merchantUid,
      merchantUid: exchangeRequest.merchantUid,
      sellerId: exchangeRequest.sellerId,
      productId: exchangeRequest.productId,
      status: exchangeRequest.status,
      productVariantName: exchangeRequest.productVariantName,
      faultOf: exchangeRequest.faultOf,
      reason: exchangeRequest.reason,
      rejectReason: exchangeRequest.rejectReason,
      isSettled: exchangeRequest.isSettled,
      isProcessDelaying: exchangeRequest.isProcessDelaying,
      pickedAt: exchangeRequest.pickedAt,
      rejectedAt: exchangeRequest.rejectedAt,
      requestedAt: exchangeRequest.requestedAt,
      settledAt: exchangeRequest.settledAt,
      reshippedAt: exchangeRequest.reshippedAt,
      reshippingAt: exchangeRequest.reshippingAt,
      convertedAt: exchangeRequest.convertedAt,
      orderBuyerName: exchangeRequest.orderItem?.order?.buyer?.name,
      orderBuyerPhoneNumber:
        exchangeRequest.orderItem?.order?.buyer?.phoneNumber,
      reShipmentTrackCode: exchangeRequest.reShipment?.trackCode,
      pickShipmentTrackCode: exchangeRequest.pickShipment?.trackCode,
    };
  }
}
