import { Test, TestingModule } from '@nestjs/testing';
import faker from 'faker';

import {
  JobExecutionRecordRepository,
  StepExecutionRecordRepository,
} from '@src/modules/common/jobs/jobs.repository';
import { JobsService } from '@src/modules/common/jobs/jobs.service';
import {
  JobExecutionRecord,
  StepExecutionRecord,
} from '@src/modules/common/jobs/models';

import { JobExecutionBuilder } from './builders';
import { JobExecutionCreator } from './creators';
import { BaseStep } from './jobs/base.step';
import { BaseJob } from './jobs/base.job';
import { JobExecutionContext } from './models';

import { BatchWorker } from './batch.worker';

class TestStep extends BaseStep {
  async tasklet() {
    return null;
  }
}

class TestJob extends BaseJob {
  createExecution(jobExecutionBuilder: JobExecutionBuilder) {
    return jobExecutionBuilder.build();
  }
}

describe('BatchWorker', () => {
  let batchWorker: BatchWorker;
  let jobsService: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchWorker,
        JobsService,
        JobExecutionRecordRepository,
        StepExecutionRecordRepository,
      ],
    }).compile();

    batchWorker = module.get<BatchWorker>(BatchWorker);
    jobsService = module.get<JobsService>(JobsService);
  });

  describe('runStep', () => {
    let testStep: TestStep;
    let testStepExecutionRecord: StepExecutionRecord;
    let jobsServiceCreateStepExecutionRecordSpy: jest.SpyInstance;
    let jobsServiceUpdateStepExecutionRecordSpy: jest.SpyInstance;

    beforeEach(() => {
      testStep = new TestStep();
      testStepExecutionRecord = new StepExecutionRecord();
      jobsServiceCreateStepExecutionRecordSpy = jest
        .spyOn(jobsService, 'createStepExecutionRecord')
        .mockImplementationOnce(async () => testStepExecutionRecord);
      jobsServiceUpdateStepExecutionRecordSpy = jest
        .spyOn(jobsService, 'updateStepExecutionRecord')
        .mockImplementationOnce(() => null);
    });
    it('성공적으로 step을 실행한다', async () => {
      const jobExecutionContext = new JobExecutionContext();
      const jobExecutionRecordId = faker.datatype.number({
        min: 1,
        max: 100,
      });

      const mockStepExecutionRecordStartSpy = jest.spyOn(
        testStepExecutionRecord,
        'start'
      );
      const mockStepExecutionRecordCompleteSpy = jest.spyOn(
        testStepExecutionRecord,
        'complete'
      );
      const mockStepTaskletSpy = jest.spyOn(testStep, 'tasklet');

      await batchWorker.runStep(
        testStep,
        jobExecutionContext,
        jobExecutionRecordId
      );
      expect(jobsServiceCreateStepExecutionRecordSpy).toHaveBeenCalledWith({
        stepName: testStep.constructor.name,
        jobExecutionRecordId: jobExecutionRecordId,
      });
      expect(mockStepExecutionRecordStartSpy).toHaveBeenCalledTimes(1);
      expect(mockStepExecutionRecordCompleteSpy).toHaveBeenCalledTimes(1);
      expect(jobsServiceUpdateStepExecutionRecordSpy).toHaveBeenCalledWith(
        testStepExecutionRecord
      );
      expect(mockStepTaskletSpy).toHaveBeenCalledTimes(1);
      expect(mockStepTaskletSpy).toHaveBeenCalledWith(jobExecutionContext);
    });

    it('step실행 시 에러가 발생할경우, 성공적으로 에러를 처리한다.', async () => {
      const testError = new Error('error');

      jest.spyOn(testStep, 'tasklet').mockImplementationOnce(async () => {
        throw testError;
      });

      expect(batchWorker.runStep(testStep, null, null)).rejects.toThrowError();
    });
  });

  describe('run', () => {
    let job: TestJob;
    let jobExecutionRecord: JobExecutionRecord;
    let jobsServiceCreateJobExecutionRecordSpy: jest.SpyInstance;
    let jobsServiceUpdateJobExecutionRecordSpy: jest.SpyInstance;

    beforeEach(() => {
      job = new TestJob();
      jobExecutionRecord = new JobExecutionRecord({
        id: faker.datatype.number({
          min: 1,
          max: 100,
        }),
      });

      jobsServiceCreateJobExecutionRecordSpy = jest
        .spyOn(jobsService, 'createJobExecutionRecord')
        .mockImplementationOnce(async () => jobExecutionRecord);

      jobsServiceUpdateJobExecutionRecordSpy = jest
        .spyOn(jobsService, 'updateJobExecutionRecord')
        .mockImplementationOnce(() => null);
    });

    it('성공적으로 job을 수행한다', async () => {
      const jobExecution = JobExecutionCreator.create(true);
      const jobExecutionRecordStartSpy = jest.spyOn(
        jobExecutionRecord,
        'start'
      );
      const jobExecutionRecordCompleteSpy = jest.spyOn(
        jobExecutionRecord,
        'complete'
      );

      const batchWorkerRunStepsSpy = jest
        .spyOn(batchWorker, 'runSteps')
        .mockImplementationOnce(() => null);

      jest
        .spyOn(job, 'createExecution')
        .mockImplementationOnce(() => jobExecution);

      await batchWorker.run(job);

      expect(jobsServiceCreateJobExecutionRecordSpy).toHaveBeenCalledWith({
        jobName: jobExecution.jobName,
      });
      expect(jobExecutionRecordStartSpy).toHaveBeenCalled();
      expect(batchWorkerRunStepsSpy).toHaveBeenCalledWith(
        jobExecution.steps,
        jobExecution.context,
        jobExecutionRecord.id
      );
      expect(jobExecutionRecordCompleteSpy).toHaveBeenCalled();
      expect(jobsServiceUpdateJobExecutionRecordSpy).toHaveBeenCalledWith(
        jobExecutionRecord
      );
    });

    it('isSavingContext가 true면 JobExecutionRecord의 saveContextRecord를 수행한다', async () => {
      const jobExecution = JobExecutionCreator.create({
        isSavingContext: true,
      });
      const jobExecutionRecordSaveContextRecord = jest.spyOn(
        jobExecutionRecord,
        'saveContextRecord'
      );

      jest
        .spyOn(job, 'createExecution')
        .mockImplementationOnce(() => jobExecution);

      await batchWorker.run(job);
      expect(jobExecutionRecordSaveContextRecord).toHaveBeenCalledWith(
        jobExecution.context.convertToRecord()
      );
    });

    it('step이 하나도 존재하지 않으면, 에러를 발생하고 job 실행을 종료시킨다', async () => {
      const jobExecution = JobExecutionCreator.create(false);
      jest
        .spyOn(job, 'createExecution')
        .mockImplementationOnce(() => jobExecution);

      expect(batchWorker.run(job)).rejects.toThrowError();
    });

    it('job 실행시 에러가 발생하면, 성공적으로 에러를 처리한다.', async () => {
      const jobExecution = JobExecutionCreator.create(true);
      const testError = new Error('mock error');
      const jobExecutionRecordFailSpy = jest.spyOn(jobExecutionRecord, 'fail');

      const mockJobExecutionErrorHandlerSpy = jest
        .spyOn(jobExecution, 'errorHandler')
        .mockImplementationOnce(() => null);

      jest.spyOn(batchWorker, 'runSteps').mockImplementationOnce(() => {
        throw testError;
      });

      jest
        .spyOn(job, 'createExecution')
        .mockImplementationOnce(() => jobExecution);

      await batchWorker.run(job);

      expect(jobExecutionRecordFailSpy).toHaveBeenCalledWith(testError);
      expect(mockJobExecutionErrorHandlerSpy).toHaveBeenCalledWith(testError);
    });
  });
});
