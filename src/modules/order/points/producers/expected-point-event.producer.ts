import { Injectable } from '@nestjs/common';
import { SqsService } from '@pickk/nestjs-sqs';

import { REMOVE_EXPECTED_POINT_EVENT_QUEUE } from '../constants';
import { RemoveExpectedPointEventDto } from '../dtos';

@Injectable()
export class ExpectedPointEventProducer {
  constructor(private readonly sqsService: SqsService) {}

  public async remove(
    removeExpectedPointEventDto: RemoveExpectedPointEventDto
  ) {
    await this.sqsService.send<RemoveExpectedPointEventDto>(
      REMOVE_EXPECTED_POINT_EVENT_QUEUE,
      {
        id: removeExpectedPointEventDto.orderId.toString(),
        body: removeExpectedPointEventDto,
      }
    );
  }
}
