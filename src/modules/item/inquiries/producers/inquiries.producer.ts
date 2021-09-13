import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { SEND_INQUIRY_CREATION_SLACK_MESSAGE_QUEUE } from '@queue/constants';
import { SendInquiryCreatedSlackMessageMto } from '@queue/mtos';

import { Inquiry } from '../models';

@Injectable()
export class InquiriesProducer {
  constructor(private readonly sqsService: SqsService) {}

  async sendInquiryCreationSlackMessage(inquiry: Inquiry) {
    await this.sqsService.send<SendInquiryCreatedSlackMessageMto>(
      SEND_INQUIRY_CREATION_SLACK_MESSAGE_QUEUE,
      {
        id: inquiry.id.toString(),
        body: {
          inquiry,
        },
      }
    );
  }
}
