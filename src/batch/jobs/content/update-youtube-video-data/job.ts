import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { UPDATE_YOUTUBE_VIDEO_DATA_JOB } from '../constants';

import { UpdateYoutubeVideoDataStep } from './steps';

@Injectable()
export class UpdateYoutubeVideoDataJob extends BaseJob {
  constructor(
    private readonly updateYoutubeVideoDataStep: UpdateYoutubeVideoDataStep
  ) {
    super(UPDATE_YOUTUBE_VIDEO_DATA_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.updateYoutubeVideoDataStep)
      .build();
  }
}
