import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';
import { plainToClass } from 'class-transformer';

import { AlimtalkService } from '@providers/sens';
import { SEND_ORDER_COMPLETED_ALIMTALK_QUEUE } from '@queue/constants';
import { SendOrderCompletedAlimtalkMto } from '@queue/mtos';

@SqsProcess(SEND_ORDER_COMPLETED_ALIMTALK_QUEUE)
export class SendOrderCompletedAlimtalkConsumer {
  constructor(private readonly alimtalkService: AlimtalkService) {}

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const { order } = plainToClass(
      SendOrderCompletedAlimtalkMto,
      JSON.parse(message.Body)
    );
    await this.alimtalkService.sendOrderCompleted(order);
  }
}
