import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  CreateJobExecutionRecordDto,
  CreateStepExecutionRecordDto,
} from './dtos';
import {
  JobExecutionRecordRepository,
  StepExecutionRecordRepository,
} from './jobs.repository';
import { JobExecutionRecord, StepExecutionRecord } from './models';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobExecutionRecordRepository)
    private readonly jobExecutionRecordRepository: JobExecutionRecordRepository,
    @InjectRepository(StepExecutionRecordRepository)
    private readonly stepExecutionRecordRepository: StepExecutionRecordRepository
  ) {}

  async createJobExecutionRecord(
    createJobExecutionRecordDto: CreateJobExecutionRecordDto
  ) {
    const { jobName } = createJobExecutionRecordDto;
    const jobExecutionRecord = new JobExecutionRecord({
      jobName,
    });
    return await this.jobExecutionRecordRepository.save(jobExecutionRecord);
  }

  async updateJobExecutionRecord(jobExecutionRecord: JobExecutionRecord) {
    return await this.jobExecutionRecordRepository.save(jobExecutionRecord);
  }

  async createStepExecutionRecord(
    createStepExecutionRecordDto: CreateStepExecutionRecordDto
  ) {
    return await this.stepExecutionRecordRepository.save(
      new StepExecutionRecord(createStepExecutionRecordDto)
    );
  }

  async updateStepExecutionRecord(stepExecutionRecord: StepExecutionRecord) {
    return await this.stepExecutionRecordRepository.save(stepExecutionRecord);
  }
}
