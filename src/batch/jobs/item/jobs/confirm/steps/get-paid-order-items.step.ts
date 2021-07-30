import { Injectable } from '@nestjs/common';

import { IStep } from '@src/batch/interfaces';
import { JobExecutionContext } from '@src/batch/job-execution.context';

@Injectable()
export class GetPaidOrderItemsStep implements IStep {
  public async tasklet(context: JobExecutionContext) {
    console.log('step1 tasklet');
    context.put('key', 'data');

    console.log('auto confirm order items');
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('err'));
      }, 1000);
    });
  }
}
