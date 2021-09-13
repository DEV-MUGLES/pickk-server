import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { SEND_INQUIRY_ANSWERED_ALIMTALK_QUEUE } from '@queue/constants';
import { SendInquriryAnsweredAlimtalkMto } from '@queue/mtos';

@Injectable()
export class SellerInquiryProducer {
  constructor(private readonly sqsService: SqsService) {}

  async sendInquiryAnsweredAlimtalk(inquiryId: number) {
    await this.sqsService.send<SendInquriryAnsweredAlimtalkMto>(
      SEND_INQUIRY_ANSWERED_ALIMTALK_QUEUE,
      {
        id: inquiryId.toString(),
        body: {
          inquiryId,
        },
      }
    );
  }
}
