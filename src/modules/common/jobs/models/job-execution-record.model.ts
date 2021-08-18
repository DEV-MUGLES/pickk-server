import { ObjectType } from '@nestjs/graphql';

import { ERROR_MESSAGE_LENGTH, JobStatus } from '../constants';
import { JobExecutionRecordEntity } from '../entities';
import { JobExecutionContextRecord } from './job-execution-context-record.model';

@ObjectType()
export class JobExecutionRecord extends JobExecutionRecordEntity {
  constructor(attributes?: Partial<JobExecutionRecord>) {
    super(attributes);
  }

  private markCompleted() {
    this.status = JobStatus.Completed;
  }

  private markStarted() {
    this.status = JobStatus.Started;
    this.startedAt = new Date();
  }

  private markFailed() {
    this.status = JobStatus.Failed;
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

  public saveContextRecord(contextRecord: JobExecutionContextRecord) {
    this.contextRecord = contextRecord;
  }
}
