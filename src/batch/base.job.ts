import { Injectable } from '@nestjs/common';

import { JobExecution } from './models';

@Injectable()
export abstract class BaseJob {
  abstract createExecution(): JobExecution;
}
