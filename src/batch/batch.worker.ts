import { Injectable } from '@nestjs/common';
import { JobsService } from '@src/modules/common/jobs/jobs.service';
import { JobExecutionRecord } from '@src/modules/common/jobs/models';

import { JobExecution, JobExecutionContext } from './models';

import { BaseJob } from './base.job';
import { BaseStep } from './base.step';

@Injectable()
export class BatchWorker {
  constructor(private readonly jobsService: JobsService) {}

  async run(job: BaseJob) {
    const execution: JobExecution = job.createExecution();
    const { steps, context, jobName, isSavingContext } = execution;

    const jobExecutionRecord: JobExecutionRecord =
      await this.jobsService.createJobExecutionRecord({ jobName });

    try {
      jobExecutionRecord.recordStart();
      await this.runSteps(steps, context, jobExecutionRecord.id);
      jobExecutionRecord.recordComplete();
    } catch (err) {
      jobExecutionRecord.recordFail(err);
      execution.errorHandler(err);
    } finally {
      if (isSavingContext) {
        jobExecutionRecord.contextRecord = context.convertToRecord();
      }
      await this.jobsService.updateJobExecutionRecord(jobExecutionRecord);
    }
  }

  async runSteps(
    steps: BaseStep[],
    context: JobExecutionContext,
    jobExecutionRecordId: number
  ) {
    for (const step of steps) {
      await this.runStep(step, context, jobExecutionRecordId);
    }
  }

  async runStep(
    step: BaseStep,
    context: JobExecutionContext,
    jobExecutionRecordId: number
  ) {
    const stepExecutionRecord =
      await this.jobsService.createStepExecutionRecord({
        stepName: step.constructor.name,
        jobExecutionRecordId,
      });
    try {
      stepExecutionRecord.recordStart();
      await step.tasklet(context);
      stepExecutionRecord.recordComplete();
    } catch (err) {
      stepExecutionRecord.recordFail(err);
      throw new Error(err);
    } finally {
      await this.jobsService.updateStepExecutionRecord(stepExecutionRecord);
    }
  }
}
