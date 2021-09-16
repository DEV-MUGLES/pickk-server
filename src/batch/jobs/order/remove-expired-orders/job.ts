import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { REMOVE_EXPIRED_ORDERS_JOB } from '../constants';
import { RemoveExpiredOrdersStep } from './steps';

@Injectable()
export class RemoveExpiredOrdersJob extends BaseJob {
  constructor(
    private readonly removeExpiredOrdersStep: RemoveExpiredOrdersStep
  ) {
    super(REMOVE_EXPIRED_ORDERS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.removeExpiredOrdersStep)
      .build();
  }
}
