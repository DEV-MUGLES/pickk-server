import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { UPDATE_VIDEO_SCORE_JOB } from '../constants';

import { UpdateVideoScoreStep } from './steps';

@Injectable()
export class UpdateVideoScoreJob extends BaseJob {
  constructor(private readonly updateVideoScoreStep: UpdateVideoScoreStep) {
    super(UPDATE_VIDEO_SCORE_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder().start(this.updateVideoScoreStep).build();
  }
}
