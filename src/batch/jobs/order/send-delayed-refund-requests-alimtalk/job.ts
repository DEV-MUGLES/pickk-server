import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
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

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.sendDelayedRefundRequestsAlimtalkStep)
      .build();
  }
}
