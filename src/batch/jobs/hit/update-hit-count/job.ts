import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { UPDATE_HIT_COUNT_JOB } from '../constants';

import {
  UpdateDigestHitCountStep,
  UpdateItemHitCountStep,
  UpdateLookHitCountStep,
  UpdateVideoHitCountStep,
} from './steps';

@Injectable()
export class UpdateHitCountJob extends BaseJob {
  constructor(
    private readonly updateDigestHitCountStep: UpdateDigestHitCountStep,
    private readonly updateItemHitCountStep: UpdateItemHitCountStep,
    private readonly updateLookHitCountStep: UpdateLookHitCountStep,
    private readonly updateVideoHitCountStep: UpdateVideoHitCountStep
  ) {
    super(UPDATE_HIT_COUNT_JOB);
  }
  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.updateDigestHitCountStep)
      .next(this.updateItemHitCountStep)
      .next(this.updateLookHitCountStep)
      .next(this.updateVideoHitCountStep)
      .build();
  }
}
