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
  abstract createExecution(): JobExecution;

  /**
   * createExecution메소드 구현 시 사용되는 메소드입니다.
   *
   * @returns jobExecutionBuilder를 반환합니다.
   */
  protected getExecutionBuilder(): JobExecutionBuilder {
    return new JobExecutionBuilder().get(this.name);
  }
}
