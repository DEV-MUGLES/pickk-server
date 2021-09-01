import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { UPDATE_DIGEST_SCORE_JOB } from '../constants';

import { UpdateDigestScoreStep } from './steps';

@Injectable()
export class UpdateDigestScoreJob extends BaseJob {
  constructor(private readonly updateDigestScoreStep: UpdateDigestScoreStep) {
    super(UPDATE_DIGEST_SCORE_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder().start(this.updateDigestScoreStep).build();
  }
}
