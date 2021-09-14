import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { PROCESS_VBANK_PAID_ORDER_QUEUE } from '@queue/constants';
import { ProcessVbankPaidOrderMto } from '@queue/mtos';

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
    order.markPaid();
    await this.ordersRepository.save(order);
  }
}
