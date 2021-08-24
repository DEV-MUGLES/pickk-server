import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { UPDATE_ITEM_IS_SOLDOUT_JOB } from '../constants';

import { UpdateItemIsSoldoutStep } from './steps';

@Injectable()
export class UpdateItemIsSoldoutJob extends BaseJob {
  constructor(
    private readonly updateItemIsSoldoutStep: UpdateItemIsSoldoutStep
  ) {
    super(UPDATE_ITEM_IS_SOLDOUT_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.updateItemIsSoldoutStep)
      .build();
  }
}
