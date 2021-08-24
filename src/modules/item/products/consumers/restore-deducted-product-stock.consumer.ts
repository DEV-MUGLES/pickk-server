import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { ProductsService } from '@item/products/products.service';
import { RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE } from '@queue/constants';
import { RestoreDeductedProductStockMto } from '@queue/mtos';

@SqsProcess(RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE)
export class RestoreDeductedProductStockConsumer {
  constructor(private readonly productsService: ProductsService) {}

  @SqsMessageHandler()
  async restoreStock(message: AWS.SQS.Message) {
    const {
      order: { orderItems },
    }: RestoreDeductedProductStockMto = JSON.parse(message.Body);

    await this.productsService.bulkRestock(orderItems);
  }
}
