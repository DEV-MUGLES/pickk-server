import { Injectable } from '@nestjs/common';
import { BaseJob } from '@src/batch/base.job';
import { JobExecutionBuilder } from '@src/batch/job-execution.builder';
import { JobExecution } from '@src/batch/job.execution';

import { GetPaidOrderItemsStep } from './steps/get-paid-order-items.step';

@Injectable()
export class ConfirmOrderItemsJob extends BaseJob {
  constructor(private readonly getPaidOrderItemsStep: GetPaidOrderItemsStep) {
    super();
  }

  createExecution(): JobExecution {
    return new JobExecutionBuilder()
      .get('auto')
      .start(this.getPaidOrderItemsStep)
      .addErrorHandler(this.handleError)
      .saveContext()
      .build();
  }

  async handleError(e: Error) {
    console.log('handleError', e);
  }
}
