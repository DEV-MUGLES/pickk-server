import { Injectable, Logger } from '@nestjs/common';

import { ItemCategorySeeder } from './item-category.seeder';

@Injectable()
export class SeederService {
  constructor(
    private readonly logger: Logger,
    private readonly itemCategorySeeder: ItemCategorySeeder
  ) {}
  async seed() {
    await this.itemCategorySeeder.seed();
    this.logger.debug('Successfuly completed seeding ItemCategory...');
  }
}
