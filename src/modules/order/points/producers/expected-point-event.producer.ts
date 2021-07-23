import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { REMOVE_EXPECTED_POINT_EVENT_QUEUE } from '../constants';
import { RemoveExpectedPointEventMto } from '../mtos';

@Injectable()
export class ExpectedPointEventProducer {
  constructor(private readonly sqsService: SqsService) {}

  public async removeByOrderId(orderId: number) {
    await this.sqsService.send<RemoveExpectedPointEventMto>(
      REMOVE_EXPECTED_POINT_EVENT_QUEUE,
      {
        id: orderId.toString(),
        body: { orderId },
      }
    );
  }
}
