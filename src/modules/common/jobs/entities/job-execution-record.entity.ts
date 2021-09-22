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

import { ERROR_MESSAGE_LENGTH, JobStatus } from '../constants';
import { IJobExecutionRecord } from '../interfaces';
import { StepExecutionRecord } from '../models';

import { JobEntity } from './job.entity';
import { JobExecutionContextRecordEntity } from './job-execution-context-record.entity';

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
    this.job = attributes.job;
    this.jobName = attributes.jobName;
    this.contextRecord = attributes.contextRecord;
    this.contextRecordId = attributes.contextRecordId;

    this.stepExecutionRecords = attributes.stepExecutionRecords;

    this.status = attributes.status;
    this.startedAt = attributes.startedAt;
    this.endAt = attributes.endAt;

    this.errorMessage = attributes.errorMessage;
  }

  @ManyToOne('JobEntity', { onDelete: 'CASCADE' })
  job: JobEntity;
  @Column()
  jobName: string;
  @OneToOne(() => JobExecutionContextRecordEntity, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  contextRecord: JobExecutionContextRecordEntity;
  @Column({ nullable: true })
  contextRecordId: number;

  @OneToMany('StepExecutionRecordEntity', 'jobExecutionRecord', {
    cascade: true,
  })
  stepExecutionRecords: StepExecutionRecord[];

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.STARTED })
  status: JobStatus;
  @Column({ nullable: true })
  @IsDate()
  startedAt: Date;
  @Column({ nullable: true })
  @IsDate()
  endAt: Date;

  @Column({ nullable: true, length: ERROR_MESSAGE_LENGTH })
  errorMessage: string;
}
