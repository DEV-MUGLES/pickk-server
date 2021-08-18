import { BaseIdEntity } from '@common/entities';
import { IsDate } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { ERROR_MESSAGE_LENGTH, StepStatus } from '../constants';
import { IStepExecutionRecord } from '../interfaces';

import { JobExecutionRecordEntity } from './job-execution-record.entity';

@Entity('step_execution_record')
export class StepExecutionRecordEntity
  extends BaseIdEntity
  implements IStepExecutionRecord
{
  constructor(attributes?: Partial<StepExecutionRecordEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }
    this.stepName = attributes.stepName;
    this.startedAt = attributes.startedAt;
    this.endAt = attributes.endAt;
    this.status = attributes.status;
    this.errorMessage = attributes.errorMessage;
    this.jobExecutionRecord = attributes.jobExecutionRecord;
    this.jobExecutionRecordId = attributes.jobExecutionRecordId;
  }
  @Column({ length: 50 })
  stepName: string;

  @Column({
    type: 'enum',
    enum: StepStatus,
    default: StepStatus.Started,
  })
  status: string;

  @Column({ nullable: true, length: ERROR_MESSAGE_LENGTH })
  errorMessage: string;

  @Column({ nullable: true })
  jobExecutionRecordId: number;

  @ManyToOne(
    () => JobExecutionRecordEntity,
    (jobExecutionEntity) => jobExecutionEntity.stepExecutionRecords,
    { onDelete: 'CASCADE' }
  )
  jobExecutionRecord: JobExecutionRecordEntity;

  @Column({ nullable: true })
  @IsDate()
  startedAt: Date;

  @Column({ nullable: true })
  @IsDate()
  endAt: Date;
}
