import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecutionBuilder } from '@batch/builders';
import { JobExecution } from '@batch/models';

import { PROCESS_DELAYED_EXCHANGE_REQUESTS_JOB } from '../constants';

@Injectable()
export class ProcessDelayedExchangeRequestsJob extends BaseJob {
  constructor() {
    super(PROCESS_DELAYED_EXCHANGE_REQUESTS_JOB);
  }

  createExecution(jobExecutionBuilder: JobExecutionBuilder): JobExecution {
    return jobExecutionBuilder.get(this.name).build();
  }
}
