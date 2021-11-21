import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@nestjs-packages/sqs';

import { SEND_INQUIRY_ANSWERED_ALIMTALK_QUEUE } from '@queue/constants';
import { SendInquriryAnsweredAlimtalkMto } from '@queue/mtos';
import { AlimtalkService } from '@providers/sens';

import { InquiriesService } from '@item/inquiries/inquiries.service';

@SqsProcess(SEND_INQUIRY_ANSWERED_ALIMTALK_QUEUE)
export class SendInquiryAnsweredAlimtalkConsumer {
  constructor(
    private readonly inquiriesService: InquiriesService,
    private readonly alimtalkService: AlimtalkService
  ) {}

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const { inquiryId }: SendInquriryAnsweredAlimtalkMto = JSON.parse(
      message.Body
    );

    const inquiry = await this.inquiriesService.get(inquiryId, [
      'user',
      'answers',
      'item',
    ]);

    await this.alimtalkService.sendInquiryAnswered(inquiry);
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.PROCESSING_ERROR)
  pro(error: Error) {
    console.error(error);
  }
}
