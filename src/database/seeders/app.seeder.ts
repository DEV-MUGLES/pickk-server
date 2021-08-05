import { Injectable, Logger } from '@nestjs/common';

import { BaseSeeder } from './base.seeder';
import { ItemCategorySeeder } from './item-category.seeder';

@Injectable()
export class AppSeeder extends BaseSeeder {
  constructor(
    private readonly logger: Logger,
    private readonly itemCategorySeeder: ItemCategorySeeder
  ) {
    super();
  }

  async seed() {
    await this.itemCategorySeeder.seed();
    this.logger.debug('Successfuly completed seeding ItemCategory...');
  }
}
