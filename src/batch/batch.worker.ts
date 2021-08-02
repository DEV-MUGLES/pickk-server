import { Injectable } from '@nestjs/common';
import { JobsService } from '@src/modules/common/jobs/jobs.service';
import { JobExecutionRecord } from '@src/modules/common/jobs/models';
import { Connection, EntityManager } from 'typeorm';

import { BaseJob } from './base.job';
import { IStep } from './interfaces';
import { JobExecutionContext } from './job-execution.context';
import { JobExecution } from './job.execution';

@Injectable()
export class BatchWorker {
  constructor(
    private readonly jobsService: JobsService,
    private readonly connection: Connection
  ) {}

  async run(job: BaseJob) {
    const execution: JobExecution = job.createExecution();
    const { steps, context, jobName, _saveContext: saveContext } = execution;

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
      if (saveContext) {
        jobExecutionRecord.contextRecord = context.convertToRecord();
      }
      await this.jobsService.updateJobExecutionRecord(jobExecutionRecord);
    }
  }

  async runSteps(
    steps: IStep[],
    context: JobExecutionContext,
    jobExecutionRecordId: number
  ) {
    await this.connection.transaction(async (transactionalEntityManager) => {
      for (const step of steps) {
        await this.runStep(
          step,
          context,
          transactionalEntityManager,
          jobExecutionRecordId
        );
      }
    });
  }

  async runStep(
    step: IStep,
    context: JobExecutionContext,
    transactionalEntityManager: EntityManager,
    jobExecutionRecordId: number
  ) {
    const stepExecutionRecord =
      await this.jobsService.createStepExecutionRecord({
        stepName: step.constructor.name,
        jobExecutionRecordId,
      });
    try {
      stepExecutionRecord.recordStart();

      if (step.tasklet) {
        await step.tasklet(transactionalEntityManager, context);
      } else {
        const result = step.process
          ? await step.process(await step.read(context), context)
          : await step.read(context);
        await step.write(result, transactionalEntityManager, context);
      }

      stepExecutionRecord.recordComplete();
    } catch (err) {
      stepExecutionRecord.recordFail(err);
      throw new Error(err);
    } finally {
      await this.jobsService.updateStepExecutionRecord(stepExecutionRecord);
    }
  }
}
