import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { UPDATE_LOOK_SCORE_JOB } from '../constants';

import { UpdateLookScoreStep } from './steps';

@Injectable()
export class UpdateLookScoreJob extends BaseJob {
  constructor(private readonly updateLookScoreStep: UpdateLookScoreStep) {
    super(UPDATE_LOOK_SCORE_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder().start(this.updateLookScoreStep).build();
  }
}
