import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { INDEX_LOOKS_JOB } from '../constants';

import { IndexLooksStep } from './steps';

@Injectable()
export class IndexLooksJob extends BaseJob {
  constructor(private readonly indexLooksStep: IndexLooksStep) {
    super(INDEX_LOOKS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder().start(this.indexLooksStep).build();
  }
}
