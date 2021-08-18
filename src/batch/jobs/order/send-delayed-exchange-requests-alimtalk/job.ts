import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecutionBuilder } from '@batch/builders';
import { JobExecution } from '@batch/models';

import { PROCESS_DELAYED_ORDER_ITEMS_JOB } from '../constants';

import { SendDelayedExchangeRequestsAlimtalkStep } from './steps';

@Injectable()
export class SendDelayedExchangeRequestsAlimtalkJob extends BaseJob {
  constructor(
    private readonly sendDelayedExchangeRequestsAlimtalkStep: SendDelayedExchangeRequestsAlimtalkStep
  ) {
    super(PROCESS_DELAYED_ORDER_ITEMS_JOB);
  }

  createExecution(jobExecutionBuilder: JobExecutionBuilder): JobExecution {
    return jobExecutionBuilder
      .get(this.name)
      .start(this.sendDelayedExchangeRequestsAlimtalkStep)
      .build();
  }
}
