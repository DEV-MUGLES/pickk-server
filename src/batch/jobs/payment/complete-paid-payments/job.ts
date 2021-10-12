import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { COMPLETE_PAID_PAYMENTS_JOB } from '../constants';
import { CompletePaidPaymentsStep } from './steps';

@Injectable()
export class CompletePaidPaymentsJob extends BaseJob {
  constructor(
    private readonly completePaidPaymentsStep: CompletePaidPaymentsStep
  ) {
    super(COMPLETE_PAID_PAYMENTS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.completePaidPaymentsStep)
      .build();
  }
}
