import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { INDEX_DIGESTS_JOB } from '../constants';

import { IndexDigestsStep } from './steps';

@Injectable()
export class IndexDigestsJob extends BaseJob {
  constructor(private readonly indexDigestsStep: IndexDigestsStep) {
    super(INDEX_DIGESTS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder().start(this.indexDigestsStep).build();
  }
}
