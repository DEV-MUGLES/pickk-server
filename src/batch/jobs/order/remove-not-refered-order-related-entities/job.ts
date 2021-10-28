import { Injectable } from '@nestjs/common';

import { BaseJob } from '@batch/jobs/base.job';
import { JobExecution } from '@batch/models';

import { REMOVE_NOT_REFERED_ORDER_RELATED_ENTITIES_JOB } from '../constants';
import {
  RemoveOrderBuyersStep,
  RemoveOrderReceiversStep,
  RemoveOrderRefundAccountsStep,
  RemoveOrderVbankReceiptsStep,
} from './steps';

@Injectable()
export class RemoveNotReferedOrderRelatedEntitiesJob extends BaseJob {
  constructor(
    private readonly removeOrderBuyersStep: RemoveOrderBuyersStep,
    private readonly removeOrderReceiversStep: RemoveOrderReceiversStep,
    private readonly removeOrderRefundAccountsStep: RemoveOrderRefundAccountsStep,
    private readonly removeOrderVbankReceiptsStep: RemoveOrderVbankReceiptsStep
  ) {
    super(REMOVE_NOT_REFERED_ORDER_RELATED_ENTITIES_JOB);
  }

  createExecution(): JobExecution {
    return this.getExecutionBuilder()
      .start(this.removeOrderBuyersStep)
      .next(this.removeOrderReceiversStep)
      .next(this.removeOrderRefundAccountsStep)
      .next(this.removeOrderVbankReceiptsStep)
      .build();
  }
}
