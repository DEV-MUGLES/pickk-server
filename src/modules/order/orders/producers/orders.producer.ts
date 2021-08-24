import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE } from '@queue/constants';
import { RestoreDeductedProductStockMto } from '@queue/mtos';

@Injectable()
export class OrdersProducer {
  constructor(private readonly sqsService: SqsService) {}

  async restoreDeductedProductStock(mto: RestoreDeductedProductStockMto) {
    await this.sqsService.send<RestoreDeductedProductStockMto>(
      RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE,
      {
        id: mto.order.merchantUid,
        body: mto,
      }
    );
  }
}