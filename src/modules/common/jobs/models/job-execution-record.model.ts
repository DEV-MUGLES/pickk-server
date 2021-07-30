import { ObjectType } from '@nestjs/graphql';

import { JobStatus } from '../constants';
import { JobExecutionRecordEntity } from '../entities/job-execution-record.entity';

@ObjectType()
export class JobExecutionRecord extends JobExecutionRecordEntity {
  constructor(attributes?: Partial<JobExecutionRecord>) {
    super(attributes);
  }

  public recordComplete() {
    this.status = JobStatus.Completed;
    this.endAt = new Date();
  }

  public recordStart() {
    this.status = JobStatus.Started;
    this.startAt = new Date();
  }

  public async recordFail(err: Error) {
    this.exitMessage = err.message;
    this.status = JobStatus.Failed;
    this.endAt = new Date();
  }
}
