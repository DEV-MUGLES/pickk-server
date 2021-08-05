import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  CreateJobExecutionRecordDto,
  CreateStepExecutionRecordDto,
} from './dtos';
import { Job, JobExecutionRecord, StepExecutionRecord } from './models';

import {
  JobExecutionRecordRepository,
  JobRepository,
  StepExecutionRecordRepository,
} from './jobs.repository';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobExecutionRecordRepository)
    private readonly jobExecutionRecordRepository: JobExecutionRecordRepository,
    @InjectRepository(StepExecutionRecordRepository)
    private readonly stepExecutionRecordRepository: StepExecutionRecordRepository,
    @InjectRepository(JobRepository)
    private readonly jobRepository: JobRepository
  ) {}

  async findJob(name: string) {
    return await this.jobRepository.findOne(name);
  }

  async createJob(name: string) {
    return await this.jobRepository.save(new Job({ name }));
  }

  async getJob(name: string) {
    const job = await this.findJob(name);
    return job ?? (await this.createJob(name));
  }

  async createJobExecutionRecord(dto: CreateJobExecutionRecordDto) {
    return await this.jobExecutionRecordRepository.save(
      new JobExecutionRecord(dto)
    );
  }

  async updateJobExecutionRecord(model: JobExecutionRecord) {
    return await this.jobExecutionRecordRepository.save(model);
  }

  async createStepExecutionRecord(dto: CreateStepExecutionRecordDto) {
    return await this.stepExecutionRecordRepository.save(
      new StepExecutionRecord(dto)
    );
  }

  async updateStepExecutionRecord(model: StepExecutionRecord) {
    return await this.stepExecutionRecordRepository.save(model);
  }
}
