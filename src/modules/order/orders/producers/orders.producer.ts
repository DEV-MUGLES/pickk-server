import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import {
  RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE,
  SAVE_BUYER_INFO_QUEUE,
  SEND_CANCEL_ORDER_APPROVED_ALIMTALK_QUEUE,
  SEND_ORDER_COMPLETED_ALIMTALK_QUEUE,
  SEND_REFUND_REQUESTED_ALIMTALK_QUEUE,
} from '@queue/constants';
import {
  RestoreDeductedProductStockMto,
  SaveBuyerInfoMto,
  SendCancelOrderApprovedAlimtalkMto,
  SendOrderCompletedAlimtalkMto,
  SendRefundRequestedAlimtalkMto,
} from '@queue/mtos';

import { OrderBuyerInput } from '../dtos';
import { Order } from '../models';

@Injectable()
export class OrdersProducer {
  constructor(private readonly sqsService: SqsService) {}

  async restoreDeductedProductStock(orderItemMerchantUids: string[]) {
    await this.sqsService.send<RestoreDeductedProductStockMto>(
      RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE,
      {
        id: getRandomUuid(),
        body: { orderItemMerchantUids },
      }
    );
  }

  async sendCancelOrderApprovedAlimtalk(
    orderMerchantUid: string,
    orderItemMerchantUids: string[]
  ) {
    await this.sqsService.send<SendCancelOrderApprovedAlimtalkMto>(
      SEND_CANCEL_ORDER_APPROVED_ALIMTALK_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          orderMerchantUid,
          orderItemMerchantUids,
        },
      }
    );
  }

  async sendOrderCompletedAlimtalk(order: Order) {
    await this.sqsService.send<SendOrderCompletedAlimtalkMto>(
      SEND_ORDER_COMPLETED_ALIMTALK_QUEUE,
      {
        id: getRandomUuid(),
        body: { order },
      }
    );
  }

  async sendRefundRequestedAlimtalk(merchantUid: string) {
    await this.sqsService.send<SendRefundRequestedAlimtalkMto>(
      SEND_REFUND_REQUESTED_ALIMTALK_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          merchantUid,
        },
      }
    );
  }

  async saveBuyerInfo(userId: number, buyerInput: OrderBuyerInput) {
    await this.sqsService.send<SaveBuyerInfoMto>(SAVE_BUYER_INFO_QUEUE, {
      id: getRandomUuid(),
      body: { userId, buyerInput },
    });
  }
}
