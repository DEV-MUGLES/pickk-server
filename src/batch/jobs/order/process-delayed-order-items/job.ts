import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { PROCESS_DELAYED_ORDER_ITEMS_JOB } from '../constants';
import { UpdateDelayedOrderItemsStep } from './steps';

@Injectable()
export class ProcessDelayedOrderItemsJob extends BaseJob {
  constructor(
    private readonly updateDelayedOrderItemsStep: UpdateDelayedOrderItemsStep
  ) {
    super(PROCESS_DELAYED_ORDER_ITEMS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.updateDelayedOrderItemsStep)
      .build();
  }
}
