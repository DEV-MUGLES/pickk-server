import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateJobExecutionRecordDto } from './dtos';
import { JobExecutionRecordRepository } from './jobs.repository';
import { JobExecutionRecord, StepExecutionRecord } from './models';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobExecutionRecordRepository)
    private readonly jobExecutionRecordRepository: JobExecutionRecordRepository
  ) {}

  async createJobExecutionRecord(
    createJobExecutionRecordDto: CreateJobExecutionRecordDto
  ) {
    const { steps, jobName } = createJobExecutionRecordDto;
    const stepExecutionRecords = steps.map(
      (step) => new StepExecutionRecord({ stepName: step.constructor.name })
    );
    const jobExecutionRecord = new JobExecutionRecord({
      jobName,
      stepExecutionRecords,
    });
    return await this.jobExecutionRecordRepository.save(jobExecutionRecord);
  }

  async updateJobExecutionRecord(jobExecutionRecord: JobExecutionRecord) {
    console.log(jobExecutionRecord);
    return await this.jobExecutionRecordRepository.save(jobExecutionRecord);
  }
}
