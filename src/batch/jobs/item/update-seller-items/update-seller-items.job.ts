import { Injectable } from '@nestjs/common';

import { BaseJob } from '@src/batch/jobs/base.job';
import { JobExecutionBuilder } from '@src/batch/builders';
import { JobExecution } from '@src/batch/models';

import { UPDATE_SELLER_ITEMS_JOB } from '../constants';

import { ProduceScrapSellerItemsMessageStep } from './steps';

@Injectable()
export class UpdateSellerItemsJob extends BaseJob {
  constructor(
    private readonly produceScrapSellerItemsMessageStep: ProduceScrapSellerItemsMessageStep
  ) {
    super(UPDATE_SELLER_ITEMS_JOB);
  }

  createExecution(jobExecutionBuilder: JobExecutionBuilder): JobExecution {
    return jobExecutionBuilder
      .get(this.name)
      .start(this.produceScrapSellerItemsMessageStep)
      .build();
  }
}
