import { BaseIdEntity } from '@common/entities';
import { IsDate } from 'class-validator';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { JobStatus } from '../constants';
import { IJobExecutionRecord } from '../interfaces';
import { StepExecutionRecord } from '../models';

import { JobEntity } from './job.entity';
import { JobExecutionContextRecordEntity } from './job-execution-context-record.entity';
import { StepExecutionRecordEntity } from './step-execution-record.entity';

@Entity({ name: 'job_execution_record' })
export class JobExecutionRecordEntity
  extends BaseIdEntity
  implements IJobExecutionRecord
{
  constructor(attributes?: Partial<JobExecutionRecordEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }
    this.startedAt = attributes.startedAt;
    this.endAt = attributes.endAt;
    this.status = attributes.status;
    this.errorMessage = attributes.errorMessage;
    this.job = attributes.job;
    this.jobName = attributes.jobName;
    this.stepExecutionRecords = attributes.stepExecutionRecords;
    this.contextRecordId = attributes.contextRecordId;
    this.contextRecord = attributes.contextRecord;
  }

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.Started,
  })
  status: string;

  @Column({ nullable: true, length: 100 })
  errorMessage: string;

  @Column({ nullable: true, length: 50 })
  jobName: string;

  @ManyToOne(() => JobEntity, { onDelete: 'CASCADE' })
  job: JobEntity;

  @OneToMany(
    () => StepExecutionRecordEntity,
    (stepExecutionRecordEntity) => stepExecutionRecordEntity.jobExecutionRecord,
    {
      cascade: true,
    }
  )
  stepExecutionRecords: StepExecutionRecord[];

  @Column({ nullable: true })
  contextRecordId?: number;

  @OneToOne(() => JobExecutionContextRecordEntity, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  contextRecord?: JobExecutionContextRecordEntity;

  @Column({ nullable: true })
  @IsDate()
  startedAt: Date;

  @Column({ nullable: true })
  @IsDate()
  endAt: Date;
}
