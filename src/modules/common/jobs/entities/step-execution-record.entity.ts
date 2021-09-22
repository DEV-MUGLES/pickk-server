import { IsDate } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { ERROR_MESSAGE_LENGTH, StepStatus } from '../constants';
import { IJobExecutionRecord, IStepExecutionRecord } from '../interfaces';

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
    this.jobExecutionRecord = attributes.jobExecutionRecord;
    this.jobExecutionRecordId = attributes.jobExecutionRecordId;

    this.stepName = attributes.stepName;
    this.startedAt = attributes.startedAt;
    this.endAt = attributes.endAt;
    this.status = attributes.status;
    this.errorMessage = attributes.errorMessage;
  }
  @ManyToOne('JobExecutionRecordEntity', 'stepExecutionRecords', {
    onDelete: 'CASCADE',
  })
  jobExecutionRecord: IJobExecutionRecord;
  @Column()
  jobExecutionRecordId: number;

  @Column({ length: 50 })
  stepName: string;
  @Column({ type: 'enum', enum: StepStatus, default: StepStatus.STARTED })
  status: string;

  @Column({ nullable: true })
  @IsDate()
  startedAt: Date;
  @Column({ nullable: true })
  @IsDate()
  endAt: Date;

  @Column({ nullable: true, length: ERROR_MESSAGE_LENGTH })
  errorMessage: string;
}
