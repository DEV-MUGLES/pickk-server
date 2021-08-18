import { ObjectType } from '@nestjs/graphql';

import { ERROR_MESSAGE_LENGTH, StepStatus } from '../constants';
import { StepExecutionRecordEntity } from '../entities';

@ObjectType()
export class StepExecutionRecord extends StepExecutionRecordEntity {
  private markCompleted() {
    this.status = StepStatus.Completed;
  }

  private markStarted() {
    this.status = StepStatus.Started;
    this.startedAt = new Date();
  }

  private markFailed() {
    this.status = StepStatus.Failed;
  }

  private markEnd() {
    this.endAt = new Date();
  }

  public start() {
    this.markStarted();
  }

  public complete() {
    this.markCompleted();
    this.markEnd();
  }

  public fail(err: Error) {
    this.markFailed();
    this.markEnd();
    this.errorMessage = err.message.slice(0, ERROR_MESSAGE_LENGTH);
  }
}
