import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { INDEX_ORDER_ITEMS_QUEUE } from '@queue/constants';
import { IndexOrderItemsMto } from '@queue/mtos';

import { OrderItemSearchService } from '@mcommon/search/order-item.search.service';

import { OrderItemsService } from '../order-items.service';

@SqsProcess(INDEX_ORDER_ITEMS_QUEUE)
export class IndexOrderItemsConsumer {
  constructor(
    private readonly orderItemsService: OrderItemsService,
    private readonly orderItemSearchService: OrderItemSearchService
  ) {}

  @SqsMessageHandler(true)
  async indexOrderItems(messages: AWS.SQS.Message[]) {
    const mtos: IndexOrderItemsMto[] = messages.map(({ Body }) =>
      JSON.parse(Body)
    );
    const uniqueUids = [
      ...new Set(
        mtos.reduce((acc, { merchantUids }) => [...acc, ...merchantUids], [])
      ),
    ];

    const orderItems = await this.orderItemsService.list(
      { merchantUidIn: uniqueUids },
      null,
      ['order', 'order.buyer', 'order.receiver', 'shipment']
    );
    await this.orderItemSearchService.bulkIndex(orderItems);
  }
}
