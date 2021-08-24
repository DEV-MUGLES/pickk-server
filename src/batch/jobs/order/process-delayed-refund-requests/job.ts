import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { PROCESS_DELAYED_REFUND_REQUESTS_JOB } from '../constants';
import { UpdateDelayedRefundRequestsStep } from './steps';

@Injectable()
export class ProcessDelayedRefundRequestsJob extends BaseJob {
  constructor(
    private readonly updateDelayedRefundRequestsStep: UpdateDelayedRefundRequestsStep
  ) {
    super(PROCESS_DELAYED_REFUND_REQUESTS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.updateDelayedRefundRequestsStep)
      .build();
  }
}
