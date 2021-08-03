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

import { BaseJob } from './base.job';
import { BaseStep } from './base.step';
import { BatchWorker } from './batch.worker';

class MockStep extends BaseStep {
  async tasklet() {
    return null;
  }
}

class MockJob extends BaseJob {
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
    let mockStep: MockStep;
    let mockStepExecutionRecord: StepExecutionRecord;
    let jobsServiceCreateStepExecutionRecordSpy: jest.SpyInstance;
    let jobsServiceUpdateStepExecutionRecordSpy: jest.SpyInstance;

    beforeEach(() => {
      mockStep = new MockStep();
      mockStepExecutionRecord = new StepExecutionRecord();
      jobsServiceCreateStepExecutionRecordSpy = jest
        .spyOn(jobsService, 'createStepExecutionRecord')
        .mockImplementationOnce(async () => mockStepExecutionRecord);
      jobsServiceUpdateStepExecutionRecordSpy = jest
        .spyOn(jobsService, 'updateStepExecutionRecord')
        .mockImplementationOnce(() => null);
    });
    it('성공적으로 step을 실행한다', async () => {
      const mockJobExecutionContext = new JobExecutionContext();
      const mockJobExecutionRecordId = faker.datatype.number({
        min: 1,
        max: 100,
      });

      const mockStepExecutionRecordStartSpy = jest.spyOn(
        mockStepExecutionRecord,
        'start'
      );
      const mockStepExecutionRecordCompleteSpy = jest.spyOn(
        mockStepExecutionRecord,
        'complete'
      );
      const mockStepTaskletSpy = jest.spyOn(mockStep, 'tasklet');

      await batchWorker.runStep(
        mockStep,
        mockJobExecutionContext,
        mockJobExecutionRecordId
      );
      expect(jobsServiceCreateStepExecutionRecordSpy).toHaveBeenCalledWith({
        stepName: mockStep.constructor.name,
        jobExecutionRecordId: mockJobExecutionRecordId,
      });
      expect(mockStepExecutionRecordStartSpy).toHaveBeenCalledTimes(1);
      expect(mockStepExecutionRecordCompleteSpy).toHaveBeenCalledTimes(1);
      expect(jobsServiceUpdateStepExecutionRecordSpy).toHaveBeenCalledWith(
        mockStepExecutionRecord
      );
      expect(mockStepTaskletSpy).toHaveBeenCalledTimes(1);
      expect(mockStepTaskletSpy).toHaveBeenCalledWith(mockJobExecutionContext);
    });

    it('step실행 시 에러가 발생할경우, 성공적으로 에러를 처리한다.', async () => {
      const mockError = new Error('error');

      const mockStepExecutionRecordFailSpy = jest.spyOn(
        mockStepExecutionRecord,
        'fail'
      );

      jest.spyOn(mockStep, 'tasklet').mockImplementationOnce(() => {
        throw mockError;
      });

      try {
        await batchWorker.runStep(mockStep, null, null);
      } catch (err) {}

      expect(mockStepExecutionRecordFailSpy).toHaveBeenCalledWith(mockError);
    });
  });

  describe('run', () => {
    let mockJob: MockJob;
    let mockJobExecution: JobExecution;
    let mockJobExecutionRecord: JobExecutionRecord;
    let jobsServiceCreateJobExecutionRecordSpy: jest.SpyInstance;
    let jobsServiceUpdateJobExecutionRecordSpy: jest.SpyInstance;

    const genMockSteps = (stepCount: number) =>
      faker.datatype.array(stepCount).map(() => new MockStep());

    beforeEach(() => {
      mockJob = new MockJob();
      mockJobExecution = new JobExecution({
        jobName: faker.name.jobTitle(),
        steps: genMockSteps(5),
        errorHandler: jest.fn(),
        isSavingContext: true,
        context: new JobExecutionContext(),
      });
      mockJobExecutionRecord = new JobExecutionRecord({
        id: faker.datatype.number({
          min: 1,
          max: 100,
        }),
      });

      jobsServiceCreateJobExecutionRecordSpy = jest
        .spyOn(jobsService, 'createJobExecutionRecord')
        .mockImplementationOnce(async () => mockJobExecutionRecord);

      jobsServiceUpdateJobExecutionRecordSpy = jest
        .spyOn(jobsService, 'updateJobExecutionRecord')
        .mockImplementationOnce(() => null);

      jest
        .spyOn(mockJob, 'createExecution')
        .mockImplementationOnce(() => mockJobExecution);
    });

    it('성공적으로 job을 수행한다', async () => {
      const jobExecutionRecordStartSpy = jest.spyOn(
        mockJobExecutionRecord,
        'start'
      );
      const jobExecutionRecordCompleteSpy = jest.spyOn(
        mockJobExecutionRecord,
        'complete'
      );
      const jobExecutionRecordSaveContextRecord = jest.spyOn(
        mockJobExecutionRecord,
        'saveContextRecord'
      );

      const batchWorkerRunStepsSpy = jest
        .spyOn(batchWorker, 'runSteps')
        .mockImplementationOnce(() => null);

      await batchWorker.run(mockJob);

      expect(jobsServiceCreateJobExecutionRecordSpy).toHaveBeenCalledWith({
        jobName: mockJobExecution.jobName,
      });
      expect(jobExecutionRecordStartSpy).toHaveBeenCalled();
      expect(batchWorkerRunStepsSpy).toHaveBeenCalledWith(
        mockJobExecution.steps,
        mockJobExecution.context,
        mockJobExecutionRecord.id
      );
      expect(jobExecutionRecordSaveContextRecord).toHaveBeenCalledWith(
        mockJobExecution.context.convertToRecord()
      );
      expect(jobExecutionRecordCompleteSpy).toHaveBeenCalled();
      expect(jobsServiceUpdateJobExecutionRecordSpy).toHaveBeenCalledWith(
        mockJobExecutionRecord
      );
    });

    it('job 실행시 에러가 발생하면, 성공적으로 에러를 처리한다.', async () => {
      const mockError = new Error('mock error');
      const jobExecutionRecordFailSpy = jest.spyOn(
        mockJobExecutionRecord,
        'fail'
      );

      const mockJobExecutionErrorHandlerSpy = jest
        .spyOn(mockJobExecution, 'errorHandler')
        .mockImplementationOnce(() => null);

      jest.spyOn(batchWorker, 'runSteps').mockImplementationOnce(() => {
        throw mockError;
      });

      await batchWorker.run(mockJob);

      expect(jobExecutionRecordFailSpy).toHaveBeenCalledWith(mockError);
      expect(mockJobExecutionErrorHandlerSpy).toHaveBeenCalledWith(mockError);
    });
  });
});
