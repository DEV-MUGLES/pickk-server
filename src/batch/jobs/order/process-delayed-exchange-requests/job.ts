import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { PROCESS_DELAYED_EXCHANGE_REQUESTS_JOB } from '../constants';
import { UpdateDelayedExchangeRequestsStep } from './steps';

@Injectable()
export class ProcessDelayedExchangeRequestsJob extends BaseJob {
  constructor(
    private readonly updateDelayedExchangeRequestsStep: UpdateDelayedExchangeRequestsStep
  ) {
    super(PROCESS_DELAYED_EXCHANGE_REQUESTS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.updateDelayedExchangeRequestsStep)
      .build();
  }
}
