import { Inject, Injectable } from '@nestjs/common';
import { AlimtalkClient } from 'nest-sens';

import {
  DelayedExchangeRequestsTemplate,
  DelayedOrderItemsTemplate,
  DelayedRefundRequestsTemplate,
  RefundRequestedTemplate,
} from '@templates/alimtalk';
import { ISellerInfo } from '@templates/alimtalk/sellers/intefaces';
import { RefundRequest } from '@order/refund-requests/models';

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
}
