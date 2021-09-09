import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@pickk/nestjs-sqs';
import { plainToClass } from 'class-transformer';

import { AlimtalkService } from '@providers/sens';
import { SEND_CANCEL_ORDER_APPROVED_ALIMTALK_QUEUE } from '@queue/constants';
import { SendCancelOrderApprovedAlimtalkMto } from '@queue/mtos';

@SqsProcess(SEND_CANCEL_ORDER_APPROVED_ALIMTALK_QUEUE)
export class SendCancelOrderApprovedAlimtalkConsumer {
  constructor(private readonly alimtalkService: AlimtalkService) {}

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const { canceledOrder } = plainToClass(
      SendCancelOrderApprovedAlimtalkMto,
      JSON.parse(message.Body)
    );

    await this.alimtalkService.sendCancelOrderApproved(canceledOrder);
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.PROCESSING_ERROR)
  processingError(err: Error) {
    console.log(err);
  }
}
