import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { UPDATE_ITEM_STATE_JOB } from '../constants';

import { UpdateItemIsPurchasableStep, UpdateItemIsSoldoutStep } from './steps';

@Injectable()
export class UpdateItemStateJob extends BaseJob {
  constructor(
    private readonly updateItemIsSoldoutStep: UpdateItemIsSoldoutStep,
    private readonly updateItemIsPurchasableStep: UpdateItemIsPurchasableStep
  ) {
    super(UPDATE_ITEM_STATE_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.updateItemIsPurchasableStep)
      .next(this.updateItemIsSoldoutStep)
      .build();
  }
}
