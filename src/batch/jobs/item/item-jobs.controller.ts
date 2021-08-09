import { Controller, Post, UseGuards } from '@nestjs/common';

import { SuperSecretGuard } from '@auth/guards';

import { ItemJobsService } from './item-jobs.service';

@Controller('/jobs/item')
@UseGuards(SuperSecretGuard)
export class ItemJobsController {
  constructor(private readonly itemJobsService: ItemJobsService) {}

  @Post('/update-brand-items')
  async updateBrandItems() {
    await this.itemJobsService.updateBrandItems();
  }
}
