import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { INDEX_REFUND_REQUESTS_JOB } from '../constants';
import { IndexRefundRequestsStep } from './steps';

@Injectable()
export class IndexRefundRequestsJob extends BaseJob {
  constructor(
    private readonly indexRefundRequestsStep: IndexRefundRequestsStep
  ) {
    super(INDEX_REFUND_REQUESTS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.indexRefundRequestsStep)
      .build();
  }
}
