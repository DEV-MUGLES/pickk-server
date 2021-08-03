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
import { JobExecution, JobExecutionContext } from './models';
import { BaseStep } from './jobs/base.step';
import { BaseJob } from './jobs/base.job';

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
      const testJobExecutionContext = new JobExecutionContext();
      const testJobExecutionRecordId = faker.datatype.number({
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
        testJobExecutionContext,
        testJobExecutionRecordId
      );
      expect(jobsServiceCreateStepExecutionRecordSpy).toHaveBeenCalledWith({
        stepName: testStep.constructor.name,
        jobExecutionRecordId: testJobExecutionRecordId,
      });
      expect(mockStepExecutionRecordStartSpy).toHaveBeenCalledTimes(1);
      expect(mockStepExecutionRecordCompleteSpy).toHaveBeenCalledTimes(1);
      expect(jobsServiceUpdateStepExecutionRecordSpy).toHaveBeenCalledWith(
        testStepExecutionRecord
      );
      expect(mockStepTaskletSpy).toHaveBeenCalledTimes(1);
      expect(mockStepTaskletSpy).toHaveBeenCalledWith(testJobExecutionContext);
    });

    it('step실행 시 에러가 발생할경우, 성공적으로 에러를 처리한다.', async () => {
      const testError = new Error('error');

      const mockStepExecutionRecordFailSpy = jest.spyOn(
        testStepExecutionRecord,
        'fail'
      );

      jest.spyOn(testStep, 'tasklet').mockImplementationOnce(() => {
        throw testError;
      });

      try {
        await batchWorker.runStep(testStep, null, null);
      } catch (err) {}

      expect(mockStepExecutionRecordFailSpy).toHaveBeenCalledWith(testError);
    });
  });

  describe('run', () => {
    let testJob: TestJob;
    let testJobExecution: JobExecution;
    let testJobExecutionRecord: JobExecutionRecord;
    let jobsServiceCreateJobExecutionRecordSpy: jest.SpyInstance;
    let jobsServiceUpdateJobExecutionRecordSpy: jest.SpyInstance;

    const genMockSteps = (stepCount: number) =>
      Array(stepCount).fill(new TestStep());

    beforeEach(() => {
      testJob = new TestJob();
      testJobExecution = new JobExecution({
        jobName: faker.name.jobTitle(),
        steps: genMockSteps(5),
        errorHandler: jest.fn(),
        isSavingContext: true,
        context: new JobExecutionContext(),
      });
      testJobExecutionRecord = new JobExecutionRecord({
        id: faker.datatype.number({
          min: 1,
          max: 100,
        }),
      });

      jobsServiceCreateJobExecutionRecordSpy = jest
        .spyOn(jobsService, 'createJobExecutionRecord')
        .mockImplementationOnce(async () => testJobExecutionRecord);

      jobsServiceUpdateJobExecutionRecordSpy = jest
        .spyOn(jobsService, 'updateJobExecutionRecord')
        .mockImplementationOnce(() => null);

      jest
        .spyOn(testJob, 'createExecution')
        .mockImplementationOnce(() => testJobExecution);
    });

    it('성공적으로 job을 수행한다', async () => {
      const jobExecutionRecordStartSpy = jest.spyOn(
        testJobExecutionRecord,
        'start'
      );
      const jobExecutionRecordCompleteSpy = jest.spyOn(
        testJobExecutionRecord,
        'complete'
      );
      const jobExecutionRecordSaveContextRecord = jest.spyOn(
        testJobExecutionRecord,
        'saveContextRecord'
      );

      const batchWorkerRunStepsSpy = jest
        .spyOn(batchWorker, 'runSteps')
        .mockImplementationOnce(() => null);

      await batchWorker.run(testJob);

      expect(jobsServiceCreateJobExecutionRecordSpy).toHaveBeenCalledWith({
        jobName: testJobExecution.jobName,
      });
      expect(jobExecutionRecordStartSpy).toHaveBeenCalled();
      expect(batchWorkerRunStepsSpy).toHaveBeenCalledWith(
        testJobExecution.steps,
        testJobExecution.context,
        testJobExecutionRecord.id
      );
      expect(jobExecutionRecordSaveContextRecord).toHaveBeenCalledWith(
        testJobExecution.context.convertToRecord()
      );
      expect(jobExecutionRecordCompleteSpy).toHaveBeenCalled();
      expect(jobsServiceUpdateJobExecutionRecordSpy).toHaveBeenCalledWith(
        testJobExecutionRecord
      );
    });

    it('job 실행시 에러가 발생하면, 성공적으로 에러를 처리한다.', async () => {
      const testError = new Error('mock error');
      const jobExecutionRecordFailSpy = jest.spyOn(
        testJobExecutionRecord,
        'fail'
      );

      const mockJobExecutionErrorHandlerSpy = jest
        .spyOn(testJobExecution, 'errorHandler')
        .mockImplementationOnce(() => null);

      jest.spyOn(batchWorker, 'runSteps').mockImplementationOnce(() => {
        throw testError;
      });

      await batchWorker.run(testJob);

      expect(jobExecutionRecordFailSpy).toHaveBeenCalledWith(testError);
      expect(mockJobExecutionErrorHandlerSpy).toHaveBeenCalledWith(testError);
    });
  });
});
