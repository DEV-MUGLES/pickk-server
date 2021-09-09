import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { OrderItemStatus } from '@order/order-items/constants';

import { PROCESS_VBANK_PAID_ORDER_QUEUE } from '@queue/constants';
import { ProcessVbankPaidOrderMto } from '@queue/mtos';

import { OrderStatus } from '../constants';
import { OrdersRepository } from '../orders.repository';

@SqsProcess(PROCESS_VBANK_PAID_ORDER_QUEUE)
export class ProcessVbankPaidOrderConsumer {
  constructor(
    @InjectRepository(OrdersRepository)
    private readonly ordersRepository: OrdersRepository
  ) {}

  @SqsMessageHandler()
  async processVbankPaid(message: AWS.SQS.Message) {
    const { merchantUid }: ProcessVbankPaidOrderMto = JSON.parse(message.Body);
    const order = await this.ordersRepository.get(merchantUid, ['orderItems']);
    order.status = OrderStatus.Paid;
    order.paidAt = new Date();

    for (const orderItem of order.orderItems) {
      orderItem.status = OrderItemStatus.Paid;
      orderItem.paidAt = new Date();
    }
    await this.ordersRepository.save(order);
  }
}
