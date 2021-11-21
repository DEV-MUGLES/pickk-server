import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';
import { AlimtalkService } from '@providers/sens';

import { SEND_INQUIRY_CREATED_ALIMTALK_QUEUE } from '@queue/constants';
import { SendInquriryCreatedAlimtalkMto } from '@queue/mtos';

import { InquiriesService } from '../inquiries.service';

@SqsProcess(SEND_INQUIRY_CREATED_ALIMTALK_QUEUE)
export class SendInquiryCreatedAlimtalkConsumer {
  constructor(
    private readonly alimtalkService: AlimtalkService,
    private readonly inquiriesService: InquiriesService
  ) {}

  @SqsMessageHandler()
  async sendAlimtalk(message: AWS.SQS.Message) {
    const { inquiryId } = JSON.parse(
      message.Body
    ) as SendInquriryCreatedAlimtalkMto;

    const inquiry = await this.inquiriesService.get(inquiryId, [
      'user',
      'orderItem',
      'item',
      'seller',
      'seller.brand',
    ]);
    await this.alimtalkService.sendInquiryCreated(inquiry);
  }
}
