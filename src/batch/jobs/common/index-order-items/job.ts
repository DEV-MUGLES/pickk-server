import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { INDEX_ORDER_ITEMS_JOB } from '../constants';

import { IndexOrderItemsStep } from './steps';

@Injectable()
export class IndexOrderItemsJob extends BaseJob {
  constructor(private readonly indexOrderItemsStep: IndexOrderItemsStep) {
    super(INDEX_ORDER_ITEMS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder().start(this.indexOrderItemsStep).build();
  }
}
