import { Injectable } from '@nestjs/common';

import { BaseSearchService } from '@common/base.search.service';
import { SearchService } from '@providers/elasticsearch';

import { OrderItem } from '@order/order-items/models';
import { OrderItemsService } from '@order/order-items/order-items.service';

export type OrderItemSearchBody = Pick<
  OrderItem,
  | 'id'
  | 'merchantUid'
  | 'sellerId'
  | 'itemName'
  | 'status'
  | 'claimStatus'
  | 'paidAt'
  | 'shipReadyAt'
  | 'shippingAt'
  | 'shippedAt'
  | 'isConfirmed'
  | 'confirmedAt'
  | 'isSettled'
  | 'settledAt'
> & {
  orderBuyerName: string;
  orderBuyerPhoneNumber: string;
  orderReceiverReceiverName: string;
  shipmentTrackCode: string;
};

@Injectable()
export class OrderItemSearchService extends BaseSearchService<
  OrderItem,
  OrderItemSearchBody
> {
  name = 'order-items_index';

  constructor(
    readonly searchService: SearchService,
    private readonly orderItemsService: OrderItemsService
  ) {
    super();
  }

  async getModel(merchantUid: string | number): Promise<OrderItem> {
    return await this.orderItemsService.get(merchantUid.toString(), [
      'order',
      'order.buyer',
      'order.receiver',
      'shipment',
    ]);
  }

  toBody(orderItem: OrderItem): OrderItemSearchBody {
    return {
      id: orderItem.merchantUid,
      merchantUid: orderItem.merchantUid,
      sellerId: orderItem.sellerId,
      itemName: orderItem.itemName,
      status: orderItem.status,
      claimStatus: orderItem.claimStatus,
      paidAt: orderItem.paidAt,
      shipReadyAt: orderItem.shipReadyAt,
      shippingAt: orderItem.shippingAt,
      shippedAt: orderItem.shippedAt,
      isConfirmed: orderItem.isConfirmed,
      confirmedAt: orderItem.confirmedAt,
      isSettled: orderItem.isSettled,
      settledAt: orderItem.settledAt,
      orderBuyerName: orderItem.order?.buyer?.name,
      orderBuyerPhoneNumber: orderItem.order?.buyer?.phoneNumber,
      orderReceiverReceiverName: orderItem.order?.receiver?.receiverName,
      shipmentTrackCode: orderItem.shipment?.trackCode,
    };
  }
}
