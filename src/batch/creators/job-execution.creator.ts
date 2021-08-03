import faker from 'faker';

import { BaseStep } from '../jobs/base.step';
import { JobExecution, JobExecutionContext } from '../models';

class TestStep extends BaseStep {
  tasklet() {
    return null;
  }
}

export class JobExecutionCreator {
  static create(successOrAttributes: boolean | Partial<JobExecution>) {
    if (typeof successOrAttributes === 'boolean') {
      return new JobExecution(this.getMockAttributes(successOrAttributes));
    } else {
      return new JobExecution({
        ...this.getMockAttributes(true),
        ...successOrAttributes,
      });
    }
  }

  static getMockAttributes(success: boolean) {
    const stepCount = success ? faker.datatype.number({ min: 1, max: 10 }) : 0;
    return {
      jobName: faker.name.jobTitle(),
      steps: Array(stepCount).fill(new TestStep()),
      errorHandler: jest.fn(),
      isSavingContext: false,
      context: new JobExecutionContext(),
    };
  }
}
