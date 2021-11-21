import { Logger } from '@nestjs/common';
import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
} from '@nestjs-packages/sqs';

export abstract class BaseConsumer {
  abstract logger: Logger;

  @SqsConsumerEventHandler(SqsConsumerEvent.PROCESSING_ERROR)
  processingError(error: Error) {
    this.logger.error(error);
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.ERROR)
  error(error: Error) {
    this.logger.error(error);
  }
}
