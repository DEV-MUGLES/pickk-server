import { Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SuperSecretGuard } from '@auth/guards';

import { JobsController } from '../decorators';

import { ItemJobsService } from './item-jobs.service';

@ApiTags('jobs')
@JobsController('item')
@UseGuards(SuperSecretGuard)
export class ItemJobsController {
  constructor(private readonly itemJobsService: ItemJobsService) {}

  @Post('/update-seller-items')
  async updateBrandItems() {
    await this.itemJobsService.updateSellerItems();
  }
}
