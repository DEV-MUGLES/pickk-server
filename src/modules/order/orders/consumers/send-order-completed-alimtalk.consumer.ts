import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';
import { plainToClass } from 'class-transformer';

import { AlimtalkService } from '@providers/sens';
import { SEND_ORDER_COMPLETED_ALIMTALK_QUEUE } from '@queue/constants';
import { SendOrderCompletedAlimtalkMto } from '@queue/mtos';

import { PayMethod } from '@payment/payments/constants';

@SqsProcess(SEND_ORDER_COMPLETED_ALIMTALK_QUEUE)
export class SendOrderCompletedAlimtalkConsumer {
  constructor(private readonly alimtalkService: AlimtalkService) {}

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const { order } = plainToClass(
      SendOrderCompletedAlimtalkMto,
      JSON.parse(message.Body)
    );
    if (order.payMethod === PayMethod.Vbank) {
      await this.alimtalkService.sendVbankNoti(order);
    } else {
      await this.alimtalkService.sendOrderCompleted(order);
    }
  }
}
