import { Injectable } from '@nestjs/common';

import { JobExecutionBuilder } from '../builders';
import { JobExecution } from '../models';

@Injectable()
export abstract class BaseJob {
  protected name: string;
  /**
   *
   * @param name 해당 job의 이름을 의미합니다.
   */
  constructor(name: string) {
    this.name = name;
  }
  abstract createExecution(
    jobExecutionBuilder: JobExecutionBuilder
  ): JobExecution;
}
