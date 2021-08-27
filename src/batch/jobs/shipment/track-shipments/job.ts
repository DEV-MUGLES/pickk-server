import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { TRACK_DELIVERY_JOB } from '../constants';

import { TrackShipmentsStep } from './steps';

@Injectable()
export class TrackShipmentsJob extends BaseJob {
  constructor(private readonly trackShipmentsStep: TrackShipmentsStep) {
    super(TRACK_DELIVERY_JOB);
  }
  createExecution(): JobExecution {
    return this.getExecutionBuilder().start(this.trackShipmentsStep).build();
  }
}
