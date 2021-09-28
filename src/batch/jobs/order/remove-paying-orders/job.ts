import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { REMOVE_PAYING_ORDERS_JOB } from '../constants';
import { RemovePayingOrdersStep } from './steps';

@Injectable()
export class RemovePayingOrdersJob extends BaseJob {
  constructor(private readonly removePayingOrdersStep: RemovePayingOrdersStep) {
    super(REMOVE_PAYING_ORDERS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.removePayingOrdersStep)
      .build();
  }
}
