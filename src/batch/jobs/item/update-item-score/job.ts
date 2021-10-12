import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { UPDATE_ITEM_SCORE_JOB } from '../constants';

import { ResetItemScoreStep, UpdateItemScoreStep } from './steps';

@Injectable()
export class UpdateItemScoreJob extends BaseJob {
  constructor(
    private readonly updateItemScoreStep: UpdateItemScoreStep,
    private readonly resetItemScoreStep: ResetItemScoreStep
  ) {
    super(UPDATE_ITEM_SCORE_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.updateItemScoreStep)
      .next(this.resetItemScoreStep)
      .build();
  }
}
