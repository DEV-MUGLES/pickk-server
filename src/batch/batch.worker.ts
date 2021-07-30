import { Injectable } from '@nestjs/common';
import { JobsService } from '@src/modules/common/jobs/jobs.service';
import {
  JobExecutionRecord,
  StepExecutionRecord,
} from '@src/modules/common/jobs/models';

import { BaseJob } from './base.job';
import { IStep } from './interfaces';
import { JobExecutionContext } from './job-execution.context';
import { JobExecution } from './job.execution';

@Injectable()
export class BatchWorker {
  constructor(private readonly jobsService: JobsService) {}

  async run(job: BaseJob) {
    const execution: JobExecution = job.createExecution();
    const { steps, context, jobName, _saveContext: saveContext } = execution;

    const jobExecutionRecord: JobExecutionRecord =
      await this.jobsService.createJobExecutionRecord({ steps, jobName });

    try {
      jobExecutionRecord.recordStart();
      for (const step of steps) {
        const stepExecutionRecord =
          jobExecutionRecord.stepExecutionRecords.find(
            (v) => v.stepName === step.constructor.name
          );
        await this.executeStep(step, context, stepExecutionRecord);
      }
      jobExecutionRecord.recordComplete();
    } catch (err) {
      jobExecutionRecord.recordFail(err);
      execution.errorHandler(err);
    } finally {
      if (saveContext) {
        jobExecutionRecord.contextRecord =
          context.convertToJobExecutionContextRecord();
      }
      await this.jobsService.updateJobExecutionRecord(jobExecutionRecord);
    }
  }

  async executeStep(
    step: IStep,
    context: JobExecutionContext,
    stepExecutionRecord: StepExecutionRecord
  ) {
    try {
      stepExecutionRecord.recordStart();
      await step.tasklet(context);
      stepExecutionRecord.recordComplete();
    } catch (err) {
      stepExecutionRecord.recordFail(err);
      throw new Error(err);
    }
  }
}
