import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';

import { AlimtalkService } from '@providers/sens';
import { SEND_VBANK_PAID_ALIMTALK_QUEUE } from '@queue/constants';
import { SendVbankPaidAlimtalkMto } from '@queue/mtos';

import { OrderRelationType } from '../constants';
import { OrdersService } from '../orders.service';

@SqsProcess(SEND_VBANK_PAID_ALIMTALK_QUEUE)
export class SendVbankPaidAlimtalkConsumer {
  private ORDER_RELATION: OrderRelationType[] = [
    'receiver',
    'buyer',
    'orderItems',
  ];

  constructor(
    private readonly ordersService: OrdersService,
    private readonly alimtalkService: AlimtalkService
  ) {}

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const { merchantUid }: SendVbankPaidAlimtalkMto = JSON.parse(message.Body);
    const order = await this.ordersService.get(
      merchantUid,
      this.ORDER_RELATION
    );
    await this.alimtalkService.sendVbankPaid(order);
  }
}
