import { Injectable } from '@nestjs/common';

import { JobExecutionContext } from './models';

@Injectable()
export abstract class BaseStep {
  abstract tasklet(context: JobExecutionContext): Promise<void>;
}
