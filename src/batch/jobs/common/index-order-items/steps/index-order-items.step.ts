import { Injectable } from '@nestjs/common';

import { OrderItemsService } from '@order/order-items/order-items.service';
import { OrderItemSearchService } from '@mcommon/search/order-item.search.service';

@Injectable()
export class IndexOrderItemsStep {
  constructor(
    private readonly orderItemsService: OrderItemsService,
    private readonly orderItemSearchService: OrderItemSearchService
  ) {}

  async tasklet() {
    const orderItems = await this.orderItemsService.list(null, null, [
      'order',
      'order.buyer',
      'order.receiver',
      'shipment',
    ]);

    await this.orderItemSearchService.clear();
    await this.orderItemSearchService.bulkIndex(orderItems);
    await this.orderItemSearchService.enableFielddata('merchantUid');
  }
}
