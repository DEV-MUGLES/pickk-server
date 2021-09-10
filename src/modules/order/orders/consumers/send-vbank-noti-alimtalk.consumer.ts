import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';
import { plainToClass } from 'class-transformer';

import { AlimtalkService } from '@providers/sens';
import { SEND_VBANK_NOTI_ALIMTALK_QUEUE } from '@queue/constants';
import { SendVbankNotiAlimtalkMto } from '@queue/mtos';

@SqsProcess(SEND_VBANK_NOTI_ALIMTALK_QUEUE)
export class SendVbankNotiAlimtalkConsumer {
  constructor(private readonly alimtalkService: AlimtalkService) {}

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const { order } = plainToClass(
      SendVbankNotiAlimtalkMto,
      JSON.parse(message.Body)
    );
    await this.alimtalkService.sendVbankNoti(order);
  }
}
