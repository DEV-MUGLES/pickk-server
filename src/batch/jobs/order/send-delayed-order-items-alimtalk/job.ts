import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { PROCESS_DELAYED_ORDER_ITEMS_JOB } from '../constants';

import { SendDelayedOrderItemsAlimtalkStep } from './steps';

@Injectable()
export class SendDelayedOrderItemsAlimtalkJob extends BaseJob {
  constructor(
    private readonly sendDelayedOrderItemsAlimtalkStep: SendDelayedOrderItemsAlimtalkStep
  ) {
    super(PROCESS_DELAYED_ORDER_ITEMS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.sendDelayedOrderItemsAlimtalkStep)
      .build();
  }
}
