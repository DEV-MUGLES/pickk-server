import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { SEND_ORDERS_CREATED_ALIMTALK_JOB } from '../constants';

import { SendOrdersCreatedAlimtalkStep } from './steps';

@Injectable()
export class SendOrdersCreatedAlimtalkJob extends BaseJob {
  constructor(
    private readonly sendOrdersCreatedAlimtalkStep: SendOrdersCreatedAlimtalkStep
  ) {
    super(SEND_ORDERS_CREATED_ALIMTALK_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.sendOrdersCreatedAlimtalkStep)
      .build();
  }
}
