import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { UPDATE_ITEM_SCORE_JOB } from '../constants';

import { UpdateItemScoreStep } from './steps';

@Injectable()
export class UpdateItemScoreJob extends BaseJob {
  constructor(private readonly updateItemScoreStep: UpdateItemScoreStep) {
    super(UPDATE_ITEM_SCORE_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder().start(this.updateItemScoreStep).build();
  }
}
