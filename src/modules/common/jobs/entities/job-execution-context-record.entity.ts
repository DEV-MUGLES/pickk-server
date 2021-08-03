import { BaseIdEntity } from '@common/entities';
import { Column, Entity } from 'typeorm';

import { IJobExecutionContextRecord } from '../interfaces';

@Entity({ name: 'job_execution_context_record' })
export class JobExecutionContextRecordEntity
  extends BaseIdEntity
  implements IJobExecutionContextRecord
{
  constructor(attributes?: Partial<JobExecutionContextRecordEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }
    this.shortContext = attributes.shortContext;
  }

  @Column({ nullable: true })
  shortContext: string;
}
