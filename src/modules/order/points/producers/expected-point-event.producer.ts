import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { getRandomUuid } from '@common/helpers';
import { REMOVE_EXPECTED_POINT_EVENT_QUEUE } from '@queue/constants';
import { RemoveExpectedPointEventMto } from '@queue/mtos';

@Injectable()
export class ExpectedPointEventProducer {
  constructor(private readonly sqsService: SqsService) {}

  public async removeByOrderItemUid(merchantUid: string) {
    await this.sqsService.send<RemoveExpectedPointEventMto>(
      REMOVE_EXPECTED_POINT_EVENT_QUEUE,
      {
        id: getRandomUuid(),
        body: { merchantUid },
      }
    );
  }
}
