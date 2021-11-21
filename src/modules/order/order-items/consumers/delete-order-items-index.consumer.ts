import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { DELETE_ORDER_ITEMS_INDEX_QUEUE } from '@queue/constants';
import { DeleteOrderItemsIndexMto } from '@queue/mtos';

import { OrderItemSearchService } from '@mcommon/search/order-item.search.service';

@SqsProcess(DELETE_ORDER_ITEMS_INDEX_QUEUE)
export class DeleteOrderItemsIndexConsumer {
  constructor(
    private readonly orderItemSearchService: OrderItemSearchService
  ) {}

  @SqsMessageHandler(true)
  async deleteOrderItemsIndex(messages: AWS.SQS.Message[]) {
    const mtos: DeleteOrderItemsIndexMto[] = messages.map(({ Body }) =>
      JSON.parse(Body)
    );
    const uniqueUids = [
      ...new Set(
        mtos.reduce((acc, { merchantUids }) => [...acc, ...merchantUids], [])
      ),
    ];

    await this.orderItemSearchService.bulkDelete(uniqueUids);
  }
}
