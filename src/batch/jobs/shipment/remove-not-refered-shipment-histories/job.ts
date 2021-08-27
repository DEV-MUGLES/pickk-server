import { Injectable } from '@nestjs/common';

import { JobExecution } from '@batch/models';
import { BaseJob } from '@batch/jobs/base.job';

import { REMOVE_NOT_REFERED_SHIPMENT_HISTORIES_JOB } from '../constants';

import { RemoveNotReferedShipmentHistoriesStep } from './steps';

@Injectable()
export class RemoveNotReferedShipmentHistoriesJob extends BaseJob {
  constructor(
    private readonly removeNotReferedShipmentHistoriesStep: RemoveNotReferedShipmentHistoriesStep
  ) {
    super(REMOVE_NOT_REFERED_SHIPMENT_HISTORIES_JOB);
  }
  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.removeNotReferedShipmentHistoriesStep)
      .build();
  }
}
