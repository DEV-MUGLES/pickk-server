import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import {
  RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE,
  SEND_CANCEL_ORDER_APPROVED_ALIMTALK_QUEUE,
  SEND_ORDER_COMPLETED_ALIMTALK_QUEUE,
  SEND_VBANK_NOTI_ALIMTALK_QUEUE,
} from '@queue/constants';
import {
  RestoreDeductedProductStockMto,
  SendCancelOrderApprovedAlimtalkMto,
  SendOrderCompletedAlimtalkMto,
  SendVbankNotiAlimtalkMto,
} from '@queue/mtos';

import { Order } from '../models';

@Injectable()
export class OrdersProducer {
  constructor(private readonly sqsService: SqsService) {}

  async restoreDeductedProductStock(order: Order) {
    await this.sqsService.send<RestoreDeductedProductStockMto>(
      RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE,
      {
        id: order.merchantUid,
        body: { order },
      }
    );
  }

  async sendCancelOrderApprovedAlimtalk(canceledOrder: Order) {
    await this.sqsService.send<SendCancelOrderApprovedAlimtalkMto>(
      SEND_CANCEL_ORDER_APPROVED_ALIMTALK_QUEUE,
      {
        id: canceledOrder.merchantUid,
        body: { canceledOrder },
      }
    );
  }

  async sendVbankNotiAlimtalk(order: Order) {
    await this.sqsService.send<SendVbankNotiAlimtalkMto>(
      SEND_VBANK_NOTI_ALIMTALK_QUEUE,
      {
        id: order.merchantUid,
        body: { order },
      }
    );
  }

  async sendOrderCompletedAlimtalk(order: Order) {
    await this.sqsService.send<SendOrderCompletedAlimtalkMto>(
      SEND_ORDER_COMPLETED_ALIMTALK_QUEUE,
      {
        id: order.merchantUid,
        body: { order },
      }
    );
  }
}
