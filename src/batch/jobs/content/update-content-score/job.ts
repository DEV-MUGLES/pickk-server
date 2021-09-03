import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { UPDATE_CONTENT_SCORE_JOB } from '../constants';

import {
  UpdateDigestScoreStep,
  UpdateLookScoreStep,
  UpdateVideoScoreStep,
} from './steps';

@Injectable()
export class UpdateContentScoreJob extends BaseJob {
  constructor(
    private readonly updateDigestScoreStep: UpdateDigestScoreStep,
    private readonly updateLookScoreStep: UpdateLookScoreStep,
    private readonly updateVideoScoreStep: UpdateVideoScoreStep
  ) {
    super(UPDATE_CONTENT_SCORE_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.updateDigestScoreStep)
      .next(this.updateLookScoreStep)
      .next(this.updateVideoScoreStep)
      .build();
  }
}
