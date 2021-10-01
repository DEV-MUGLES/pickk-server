import { Inject, Injectable } from '@nestjs/common';
import { AlimtalkClient } from 'nest-sens';

import { RefundRequest } from '@order/refund-requests/models';
import { Order } from '@order/orders/models';
import { ExchangeRequest } from '@order/exchange-requests/models';
import { Inquiry } from '@item/inquiries/models';

import {
  DelayedExchangeRequestsTemplate,
  DelayedOrderItemsTemplate,
  DelayedRefundRequestsTemplate,
  ExchangeRequestedTemplate,
  CancelOrderApprovedTemplate,
  CompleteOrderTemplate,
  VbankNotiTemplate,
  InquiryAnsweredTemplate,
  InquiryCreatedTemplate,
  OrdersCreatedTemplate,
  RefundRequestedTemplate,
  RefundRequestCreatedTemplate,
  ExchangeRequestedCreatedTemplate,
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

  async sendExchangeRequested(exchangeRequest: ExchangeRequest) {
    await this.alimtalkClient.send(
      ExchangeRequestedTemplate.toRequest(exchangeRequest)
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

  async sendInquiryCreated(sellerInfo: ISellerInfo, inquiry: Inquiry) {
    await this.alimtalkClient.send(
      InquiryCreatedTemplate.toRequest(sellerInfo, inquiry)
    );
  }

  async sendOrdersCreated(sellerInfo: ISellerInfo, ordersCount: number) {
    await this.alimtalkClient.send(
      OrdersCreatedTemplate.toRequest(sellerInfo, ordersCount)
    );
  }

  async sendRefundRequestCreated(
    sellerInfo: ISellerInfo,
    refundRequest: RefundRequest
  ) {
    await this.alimtalkClient.send(
      RefundRequestCreatedTemplate.toRequest(sellerInfo, refundRequest)
    );
  }

  async sendExchangeRequestCreated(
    sellerInfo: ISellerInfo,
    exchangeRequest: ExchangeRequest
  ) {
    await this.alimtalkClient.send(
      ExchangeRequestedCreatedTemplate.toRequest(sellerInfo, exchangeRequest)
    );
  }

  async sendCancelOrderApproved(canceledOrder: Order) {
    await this.alimtalkClient.send(
      CancelOrderApprovedTemplate.toRequest(canceledOrder)
    );
  }

  async sendVbankPaid(order: Order) {
    await this.alimtalkClient.send(CompleteOrderTemplate.toRequest(order));
  }

  async sendOrderCompleted(order: Order) {
    await this.alimtalkClient.send(CompleteOrderTemplate.toRequest(order));
  }

  async sendVbankNoti(order: Order) {
    await this.alimtalkClient.send(VbankNotiTemplate.toRequest(order));
  }

  async sendInquiryAnswered(inquiry: Inquiry) {
    await this.alimtalkClient.send(InquiryAnsweredTemplate.toRequest(inquiry));
  }
}
