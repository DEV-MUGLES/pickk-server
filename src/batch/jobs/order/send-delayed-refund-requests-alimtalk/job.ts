import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecutionBuilder } from '@batch/builders';
import { JobExecution } from '@batch/models';

import { PROCESS_DELAYED_ORDER_ITEMS_JOB } from '../constants';

import { SendDelayedRefundRequestsAlimtalkStep } from './steps';

@Injectable()
export class SendDelayedRefundRequestsAlimtalkJob extends BaseJob {
  constructor(
    private readonly sendDelayedRefundRequestsAlimtalkStep: SendDelayedRefundRequestsAlimtalkStep
  ) {
    super(PROCESS_DELAYED_ORDER_ITEMS_JOB);
  }

  createExecution(jobExecutionBuilder: JobExecutionBuilder): JobExecution {
    return jobExecutionBuilder
      .get(this.name)
      .start(this.sendDelayedRefundRequestsAlimtalkStep)
      .build();
  }
}
