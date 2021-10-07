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
}
