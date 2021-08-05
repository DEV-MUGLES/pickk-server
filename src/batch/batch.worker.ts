import { Injectable } from '@nestjs/common';
import { JobsService } from '@src/modules/common/jobs/jobs.service';
import { JobExecutionRecord } from '@src/modules/common/jobs/models';

import { JobExecutionBuilder } from './builders';
import { BaseJob } from './jobs/base.job';
import { BaseStep } from './jobs/base.step';
import { JobExecution, JobExecutionContext } from './models';

@Injectable()
export class BatchWorker {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * execution의 steps과 jobName의 제약사항을 확인한다.
   * steps가 존재하지 않거나, jobName의 job이 데이터베이스에 없다면 에러를 발생한다.
   * @param execution
   */
  private async checkExecutionConstraints(execution: JobExecution) {
    const { steps, jobName } = execution;
    if (steps.length < 1) {
      throw new Error(
        'job needs at least one step, you must register step to job'
      );
    }

    if (!(await this.jobsService.getJob(jobName))) {
      throw new Error(`${jobName} job doesn\'t exist`);
    }
  }

  async run(job: BaseJob) {
    const execution: JobExecution = job.createExecution(
      new JobExecutionBuilder()
    );
    await this.checkExecutionConstraints(execution);

    const { steps, context, jobName, isSavingContext } = execution;
    const jobExecutionRecord: JobExecutionRecord =
      await this.jobsService.createJobExecutionRecord({ jobName });

    try {
      jobExecutionRecord.start();
      await this.runSteps(steps, context, jobExecutionRecord.id);
      jobExecutionRecord.complete();
    } catch (err) {
      if (err instanceof Error) {
        jobExecutionRecord.fail(err);
        if (execution.errorHandler) {
          execution.errorHandler(err);
        }
      }
    } finally {
      if (isSavingContext) {
        jobExecutionRecord.saveContextRecord(context.convertToRecord());
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
      if (err instanceof Error) {
        stepExecutionRecord.fail(err);
        throw err;
      }
    } finally {
      await this.jobsService.updateStepExecutionRecord(stepExecutionRecord);
    }
  }
}
