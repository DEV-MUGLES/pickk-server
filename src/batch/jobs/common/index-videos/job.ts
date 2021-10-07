import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { INDEX_VIDEOS_JOB } from '../constants';

import { IndexVideosStep } from './steps';

@Injectable()
export class IndexVideosJob extends BaseJob {
  constructor(private readonly indexVideosStep: IndexVideosStep) {
    super(INDEX_VIDEOS_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder().start(this.indexVideosStep).build();
  }
}
