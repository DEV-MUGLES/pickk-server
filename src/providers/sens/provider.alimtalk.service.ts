import { Inject, Injectable } from '@nestjs/common';
import { AlimtalkClient } from '@nestjs-packages/ncp-sens';

import { RefundRequest } from '@order/refund-requests/models';
import { Order } from '@order/orders/models';
import { ExchangeRequest } from '@order/exchange-requests/models';
import { Inquiry } from '@item/inquiries/models';

import {
  DelayedExchangeRequestsTemplate,
  DelayedOrderItemsTemplate,
  DelayedRefundRequestsTemplate,
  CancelOrderApprovedTemplate,
  CompleteOrderTemplate,
  VbankNotiTemplate,
  InquiryAnsweredTemplate,
  InquiryCreatedTemplate,
  OrdersCreatedTemplate,
  ExchangeRequestedCustomerTemplate,
  RefundRequestedCustomerTemplate,
  RefundRequestedSellerTemplate,
  ExchangeRequestedSellerTemplate,
  ExchangeItemReshipedTemplate,
  ExchangeCanceledCustomerTemplate,
} from '@templates/alimtalk';

import { ISellerInfo } from '@templates/alimtalk/sellers/intefaces';

@Injectable()
export class AlimtalkService {
  constructor(
    @Inject(AlimtalkClient) private readonly alimtalkClient: AlimtalkClient
  ) {}

  async sendCancelOrderApproved(canceledOrder: Order) {
    await this.alimtalkClient.send(
      CancelOrderApprovedTemplate.toRequest(canceledOrder)
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

  async sendExchangeItemReshiped(exchangeRequest: ExchangeRequest) {
    await this.alimtalkClient.send(
      ExchangeItemReshipedTemplate.toRequest(exchangeRequest)
    );
  }

  async sendExchangeRequested(exchangeRequest: ExchangeRequest) {
    await this.alimtalkClient.send(
      ExchangeRequestedCustomerTemplate.toRequest(exchangeRequest)
    );
    await this.alimtalkClient.send(
      ExchangeRequestedSellerTemplate.toRequest(exchangeRequest)
    );
  }

  async sendInquiryAnswered(inquiry: Inquiry) {
    await this.alimtalkClient.send(InquiryAnsweredTemplate.toRequest(inquiry));
  }

  async sendInquiryCreated(inquiry: Inquiry) {
    await this.alimtalkClient.send(InquiryCreatedTemplate.toRequest(inquiry));
  }

  async sendOrderCompleted(order: Order) {
    await this.alimtalkClient.send(CompleteOrderTemplate.toRequest(order));
  }

  async sendOrdersCreated(sellerInfo: ISellerInfo, ordersCount: number) {
    await this.alimtalkClient.send(
      OrdersCreatedTemplate.toRequest(sellerInfo, ordersCount)
    );
  }

  async sendRefundRequested(refundRequest: RefundRequest) {
    await this.alimtalkClient.send(
      RefundRequestedCustomerTemplate.toRequest(refundRequest)
    );
    await this.alimtalkClient.send(
      RefundRequestedSellerTemplate.toRequest(refundRequest)
    );
  }

  async sendVbankPaid(order: Order) {
    await this.alimtalkClient.send(CompleteOrderTemplate.toRequest(order));
  }

  async sendVbankNoti(order: Order) {
    await this.alimtalkClient.send(VbankNotiTemplate.toRequest(order));
  }

  async sendExchangeCanceled(exchangeRequest: ExchangeRequest) {
    await this.alimtalkClient.send(
      ExchangeCanceledCustomerTemplate.toRequest(exchangeRequest)
    );
  }
}
