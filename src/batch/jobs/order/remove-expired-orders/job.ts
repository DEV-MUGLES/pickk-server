import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { REMOVE_PENDING_FAILED_ORDER_JOB } from '../constants';
import { RemoveExpiredOrdersStep } from './steps';

@Injectable()
export class RemoveExpiredOrdersJob extends BaseJob {
  constructor(
    private readonly removeExpiredOrdersStep: RemoveExpiredOrdersStep
  ) {
    super(REMOVE_PENDING_FAILED_ORDER_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.removeExpiredOrdersStep)
      .build();
  }
}
