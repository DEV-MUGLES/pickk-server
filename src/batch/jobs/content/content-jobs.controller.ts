import { Delete, Post, UseGuards } from '@nestjs/common';

import { SuperSecretGuard } from '@auth/guards';

import { JobsController } from '../decorators';

import { ContentJobsService } from './content-jobs.service';

@JobsController('content')
@UseGuards(SuperSecretGuard)
export class ContentJobsController {
  constructor(private readonly contentJobsService: ContentJobsService) {}

  @Post('update-content-score')
  async updateDigestScore() {
    return await this.contentJobsService.updateContentScore();
  }

  @Delete('remove-deleted-digest-images')
  async removeDeletedDigestImages() {
    return await this.contentJobsService.removeDeletedDigestImages();
  }
}
