import { Controller, Get } from '@nestjs/common';

import { BatchWorker } from '../../batch.worker';

import { ConfirmOrderItemsJob } from './jobs/confirm/confirm.job';
//TODO:가드 추가하기
@Controller('/jobs/item')
export class ItemJobController {
  constructor(
    private readonly batchWorker: BatchWorker,
    private readonly confirmOrderItemsJob: ConfirmOrderItemsJob
  ) {}

  @Get('auto')
  async auto() {
    await this.batchWorker.run(this.confirmOrderItemsJob);
  }

  @Get('auto2')
  async auto2() {
    // await this.itemJobService.auto2();
  }
}
