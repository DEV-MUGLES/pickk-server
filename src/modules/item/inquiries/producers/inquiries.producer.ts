import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import {
  SEND_INQUIRY_CREATED_ALIMTALK_QUEUE,
  SEND_INQUIRY_CREATION_SLACK_MESSAGE_QUEUE,
} from '@queue/constants';
import {
  SendInquiryCreationSlackMessageMto,
  SendInquriryCreatedAlimtalkMto,
} from '@queue/mtos';

import { Inquiry } from '../models';

// FIXME: 슬랙 메세지와 알림톡 전송 큐 하나로 합치기
@Injectable()
export class InquiriesProducer {
  constructor(private readonly sqsService: SqsService) {}

  async sendInquiryCreationSlackMessage(inquiry: Inquiry) {
    await this.sqsService.send<SendInquiryCreationSlackMessageMto>(
      SEND_INQUIRY_CREATION_SLACK_MESSAGE_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          inquiry,
        },
      }
    );
  }

  async sendInquiryCreatedAlimtalk(id: number) {
    await this.sqsService.send<SendInquriryCreatedAlimtalkMto>(
      SEND_INQUIRY_CREATED_ALIMTALK_QUEUE,
      {
        id: getRandomUuid(),
        body: {
          inquiryId: id,
        },
      }
    );
  }
}
