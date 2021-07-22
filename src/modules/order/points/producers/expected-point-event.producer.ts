import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { REMOVE_EXPECTED_POINT_EVENT_QUEUE } from '../constants';
import { RemoveExpectedPointEventMto } from '../mtos';

@Injectable()
export class ExpectedPointEventProducer {
  constructor(private readonly sqsService: SqsService) {}

  public async remove(
    removeExpectedPointEventMto: RemoveExpectedPointEventMto
  ) {
    await this.sqsService.send<RemoveExpectedPointEventMto>(
      REMOVE_EXPECTED_POINT_EVENT_QUEUE,
      {
        id: removeExpectedPointEventMto.orderId.toString(),
        body: removeExpectedPointEventMto,
      }
    );
  }
}
