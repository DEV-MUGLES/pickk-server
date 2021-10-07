import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { INDEX_ITEMS_JOB } from '../constants';

import { IndexItemsStep } from './steps';

@Injectable()
export class IndexItemsJob extends BaseJob {
  constructor(private readonly indexItemsStep: IndexItemsStep) {
    super(INDEX_ITEMS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder().start(this.indexItemsStep).build();
  }
}
