import { Injectable } from '@nestjs/common';
import { JobsService } from '@src/modules/common/jobs/jobs.service';
import { JobExecutionRecord } from '@src/modules/common/jobs/models';

import { BaseJob } from './jobs/base.job';
import { BaseStep } from './jobs/base.step';
import { JobExecution, JobExecutionContext } from './models';

@Injectable()
export class BatchWorker {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * job을 입력받아 jobExecution과 jobExecutionRecord를 생성합니다.
   *
   * @param job BaseJob을 상속하여 만든 클래스
   * @returns jobExecutionContext를 반환합니다.
   */
  async run(job: BaseJob) {
    const execution: JobExecution = job.createExecution();
    const { steps, context, jobName, isSavingContext } = execution;

    if (!(await this.jobsService.getJob(jobName))) {
      throw new Error(`${jobName} job doesn\'t exist in database`);
    }
    if (steps.length === 0) {
      throw new Error('step이 한 개이상 필요합니다.');
    }

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
    return context.getAll();
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
