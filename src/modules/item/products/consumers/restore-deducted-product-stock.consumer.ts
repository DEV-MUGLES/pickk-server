import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE } from '@queue/constants';
import { RestoreDeductedProductStockMto } from '@queue/mtos';

import { OrderItemsService } from '@order/order-items/order-items.service';
import { ProductsService } from '@item/products/products.service';

import { RestockProductDto } from '../dtos';

@SqsProcess(RESTORE_DEDUCTED_PRODUCT_STOCK_QUEUE)
export class RestoreDeductedProductStockConsumer {
  constructor(
    private readonly productsService: ProductsService,
    private readonly orderItemsService: OrderItemsService
  ) {}

  @SqsMessageHandler()
  async restoreStock(message: AWS.SQS.Message) {
    const { orderItemMerchantUids }: RestoreDeductedProductStockMto =
      JSON.parse(message.Body);

    const restockProductDtos = (
      await this.orderItemsService.list({
        merchantUidIn: orderItemMerchantUids,
      })
    ).map((oi) => oi as RestockProductDto);

    await this.productsService.bulkRestock(restockProductDtos);
  }
}
