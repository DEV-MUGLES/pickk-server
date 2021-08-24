import { Injectable } from '@nestjs/common';

import { BaseJob } from '@src/batch/jobs/base.job';
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

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.produceScrapSellerItemsMessageStep)
      .build();
  }
}
