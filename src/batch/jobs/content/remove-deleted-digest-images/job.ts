import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { REMOVE_DELETED_DIGEST_IMAGES_JOB } from '../constants';

import { RemoveDeletedDigestImagesStep } from './steps';

@Injectable()
export class RemoveDeletedDigestImagesJob extends BaseJob {
  constructor(
    private readonly removeDeletedDigestImagesStep: RemoveDeletedDigestImagesStep
  ) {
    super(REMOVE_DELETED_DIGEST_IMAGES_JOB);
  }
  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.removeDeletedDigestImagesStep)
      .build();
  }
}
