import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@pickk/nestjs-sqs';

import { REMOVE_EXPECTED_POINT_EVENT_QUEUE } from '../constants';
import { RemoveExpectedPointEventMto } from '../mtos';
import { PointsService } from '../points.service';

@SqsProcess(REMOVE_EXPECTED_POINT_EVENT_QUEUE)
export class RemoveExpectedPointEventConsumer {
  constructor(private readonly pointsService: PointsService) {}

  @SqsMessageHandler()
  public async remove(message: AWS.SQS.Message) {
    const { Body } = message;
    const { orderId }: RemoveExpectedPointEventMto = JSON.parse(Body);
    await this.pointsService.removeExpectedEvent(orderId);
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.PROCESSING_ERROR)
  public processingError(error: Error, message: AWS.SQS.Message) {
    console.log(error, message);
  }
}