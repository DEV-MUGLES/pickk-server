import { Post, UseGuards } from '@nestjs/common';

import { SuperSecretGuard } from '@auth/guards';

import { JobsController } from '../decorators';

import { HitJobsService } from './hit-jobs.service';

@JobsController('hit')
@UseGuards(SuperSecretGuard)
export class HitJobsController {
  constructor(private readonly hitJobsService: HitJobsService) {}

  @Post('update-hit-count')
  async updateHitCount() {
    return await this.hitJobsService.updateHitCount();
  }
}
