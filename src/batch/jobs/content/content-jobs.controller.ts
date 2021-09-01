import { Post, UseGuards } from '@nestjs/common';

import { SuperSecretGuard } from '@auth/guards';

import { JobsController } from '../decorators';

import { ContentJobsService } from './content-jobs.service';

@JobsController('content')
@UseGuards(SuperSecretGuard)
export class ContentJobsController {
  constructor(private readonly contentJobsService: ContentJobsService) {}

  @Post('update-digest-score')
  async updateDigestScore() {
    return await this.contentJobsService.updateDigestScore();
  }

  @Post('update-look-score')
  async updateLookScore() {
    return await this.contentJobsService.updateLookScore();
  }

  @Post('update-video-score')
  async updateVideoScore() {
    return await this.contentJobsService.updateVideoScore();
  }
}
