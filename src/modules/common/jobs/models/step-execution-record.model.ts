import { ObjectType } from '@nestjs/graphql';

import { StepStatus } from '../constants';
import { StepExecutionRecordEntity } from '../entities/step-execution-record.entity';

@ObjectType()
export class StepExecutionRecord extends StepExecutionRecordEntity {
  public recordComplete() {
    this.status = StepStatus.Completed;
    this.endAt = new Date();
  }

  public recordStart() {
    this.status = StepStatus.Started;
    this.startAt = new Date();
  }

  public recordFail(err: Error) {
    this.exitMessage = err.message;
    this.status = StepStatus.Failed;
    this.endAt = new Date();
  }
}
