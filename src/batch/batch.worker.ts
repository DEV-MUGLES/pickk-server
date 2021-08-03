import { Injectable } from '@nestjs/common';
import { JobsService } from '@src/modules/common/jobs/jobs.service';
import { JobExecutionRecord } from '@src/modules/common/jobs/models';

import { JobExecutionBuilder } from './builders';
import { JobExecution, JobExecutionContext } from './models';

import { BaseJob } from './base.job';
import { BaseStep } from './base.step';

@Injectable()
export class BatchWorker {
  constructor(private readonly jobsService: JobsService) {}

  async run(job: BaseJob) {
    const execution: JobExecution = job.createExecution(
      new JobExecutionBuilder()
    );
    const { steps, context, jobName, isSavingContext } = execution;

    const jobExecutionRecord: JobExecutionRecord =
      await this.jobsService.createJobExecutionRecord({ jobName });

    try {
      jobExecutionRecord.start();
      await this.runSteps(steps, context, jobExecutionRecord.id);
      jobExecutionRecord.complete();
    } catch (err) {
      jobExecutionRecord.fail(err);
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
      stepExecutionRecord.start();
      await step.tasklet(context);
      stepExecutionRecord.complete();
    } catch (err) {
      stepExecutionRecord.fail(err);
      throw new Error(err);
    } finally {
      await this.jobsService.updateStepExecutionRecord(stepExecutionRecord);
    }
  }
}
