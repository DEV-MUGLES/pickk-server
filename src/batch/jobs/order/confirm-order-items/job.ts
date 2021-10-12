import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { CONFIRM_ORDER_ITEMS_JOB } from '../constants';

import { ConfirmOrderItemsStep, ConfirmExchangedOrderItemsStep } from './steps';

@Injectable()
export class ConfirmOrderItemsJob extends BaseJob {
  constructor(
    private readonly confirmOrderItemsStep: ConfirmOrderItemsStep,
    private readonly confirmExchangedOrderItemsStep: ConfirmExchangedOrderItemsStep
  ) {
    super(CONFIRM_ORDER_ITEMS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.confirmOrderItemsStep)
      .next(this.confirmExchangedOrderItemsStep)
      .build();
  }
}
