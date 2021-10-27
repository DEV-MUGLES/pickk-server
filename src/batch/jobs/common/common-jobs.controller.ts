import { Post, UseGuards } from '@nestjs/common';

import { SuperSecretGuard } from '@auth/guards';

import { JobsController } from '../decorators';

import { CommonJobsService } from './common-jobs.service';

@JobsController('common')
@UseGuards(SuperSecretGuard)
export class CommonJobsController {
  constructor(private readonly commonJobsService: CommonJobsService) {}

  @Post('index-items')
  async indexItems() {
    return await this.commonJobsService.indexItems();
  }

  @Post('index-digests')
  async indexDigests() {
    return await this.commonJobsService.indexDigests();
  }

  @Post('index-looks')
  async indexLooks() {
    return await this.commonJobsService.indexLooks();
  }

  @Post('index-videos')
  async indexVideos() {
    return await this.commonJobsService.indexVideos();
  }

  // 이 엔드포인트는 스케줄링하지 않습니다.
  @Post('index-order-items')
  async indexOrderItems() {
    return await this.commonJobsService.indexOrderItems();
  }

  // 이 엔드포인트는 스케줄링하지 않습니다.
  @Post('index-refund-requests')
  async indexRefundRequests() {
    return await this.commonJobsService.indexRefundRequests();
  }

  // 이 엔드포인트는 스케줄링하지 않습니다.
  @Post('index-exchange-requests')
  async indexExchangeRequests() {
    return await this.commonJobsService.indexExchangeRequests();
  }

  // 이 엔드포인트는 스케줄링하지 않습니다.
  @Post('index-inquiries')
  async indexInquires() {
    return await this.commonJobsService.indexInquires();
  }
}
