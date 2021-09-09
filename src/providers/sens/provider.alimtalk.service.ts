import { Inject, Injectable } from '@nestjs/common';
import { AlimtalkClient } from 'nest-sens';

import { RefundRequest } from '@order/refund-requests/models';
import { Order } from '@order/orders/models';

import {
  DelayedExchangeRequestsTemplate,
  DelayedOrderItemsTemplate,
  DelayedRefundRequestsTemplate,
  RefundRequestedTemplate,
  CancelOrderApprovedTemplate,
} from '@templates/alimtalk';
import { ISellerInfo } from '@templates/alimtalk/sellers/intefaces';

@Injectable()
export class AlimtalkService {
  constructor(
    @Inject(AlimtalkClient) private readonly alimtalkClient: AlimtalkClient
  ) {}

  async sendRefundRequested(refundRequest: RefundRequest) {
    await this.alimtalkClient.send(
      RefundRequestedTemplate.toRequest(refundRequest)
    );
  }

  async sendDelayedOrderItems(sellerInfo: ISellerInfo, delayedCount: number) {
    await this.alimtalkClient.send(
      DelayedOrderItemsTemplate.toRequest(sellerInfo, delayedCount)
    );
  }

  async sendDelayedRefundRequests(
    sellerInfo: ISellerInfo,
    delayedCount: number
  ) {
    await this.alimtalkClient.send(
      DelayedRefundRequestsTemplate.toRequest(sellerInfo, delayedCount)
    );
  }

  async sendDelayedExchangeRequests(
    sellerInfo: ISellerInfo,
    delayedCount: number
  ) {
    await this.alimtalkClient.send(
      DelayedExchangeRequestsTemplate.toRequest(sellerInfo, delayedCount)
    );
  }

  async sendCancelOrderApproved(canceledOrder: Order) {
    await this.alimtalkClient.send(
      CancelOrderApprovedTemplate.toRequest(canceledOrder)
    );
  }
}
