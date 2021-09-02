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
  async updateSellerItems() {
    return await this.itemJobsService.updateSellerItems();
  }

  @Post('/update-item-is-soldout')
  async updateItemIsSoldout() {
    return await this.itemJobsService.updateItemIsSoldout();
  }

  @Post('/update-item-score')
  async updateItemScore() {
    return await this.itemJobsService.updateItemScore();
  }
}
