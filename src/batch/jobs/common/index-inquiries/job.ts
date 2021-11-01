import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { INDEX_INQUIRES_JOB } from '../constants';
import { IndexInquiriesStep } from './steps';

@Injectable()
export class IndexInquiriesJob extends BaseJob {
  constructor(private readonly indexInquiresStep: IndexInquiriesStep) {
    super(INDEX_INQUIRES_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder().start(this.indexInquiresStep).build();
  }
}
