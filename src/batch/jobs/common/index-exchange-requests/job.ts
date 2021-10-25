import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { INDEX_EXCHANGE_REQUESTS_JOB } from '../constants';
import { IndexExchangeRequestsStep } from './steps';

@Injectable()
export class IndexExchangeRequestsJob extends BaseJob {
  constructor(
    private readonly indexExchangeRequestsStep: IndexExchangeRequestsStep
  ) {
    super(INDEX_EXCHANGE_REQUESTS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.indexExchangeRequestsStep)
      .build();
  }
}
