import { Injectable } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { CompletePaidPaymentsJob } from './complete-paid-payments';

@Injectable()
export class PaymentJobsService {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly completePaidPaymentsJob: CompletePaidPaymentsJob
  ) {}

  async completePaidPayments() {
    return await this.batchWorker.run(this.completePaidPaymentsJob);
  }
}
