import { Injectable } from '@nestjs/common';

import { JobExecutionBuilder } from '@batch/builders';
import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { UPDATE_HIT_COUNT_JOB } from '../constants';

import {
  UpdateDigestHitCountStep,
  UpdateLookHitCountStep,
  UpdateVideoHitCountStep,
} from './steps';

@Injectable()
export class UpdateHitCountJob extends BaseJob {
  constructor(
    private readonly updateDigestHitCountStep: UpdateDigestHitCountStep,
    private readonly updateLookHitCountStep: UpdateLookHitCountStep,
    private readonly updateVideoHitCountStep: UpdateVideoHitCountStep
  ) {
    super(UPDATE_HIT_COUNT_JOB);
  }
  createExecution(jobExecutionBuilder: JobExecutionBuilder): JobExecution {
    return jobExecutionBuilder
      .get(this.name)
      .start(this.updateDigestHitCountStep)
      .next(this.updateLookHitCountStep)
      .next(this.updateVideoHitCountStep)
      .build();
  }
}
