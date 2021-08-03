import { Injectable } from '@nestjs/common';

import { JobExecutionBuilder } from '../builders';
import { JobExecution } from '../models';

@Injectable()
export abstract class BaseJob {
  abstract createExecution(
    jobExecutionBuilder: JobExecutionBuilder
  ): JobExecution;
}
