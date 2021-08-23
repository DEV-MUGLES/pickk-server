import { Injectable, Logger } from '@nestjs/common';

import { ItemCategorySeeder } from './item-category.seeder';
import { ItemPropertySeeder } from './item-property.seeder';

@Injectable()
export class SeederService {
  constructor(
    private readonly logger: Logger,
    private readonly itemCategorySeeder: ItemCategorySeeder,
    private readonly itemPropertySeeder: ItemPropertySeeder
  ) {}
  async seed() {
    await this.itemCategorySeeder.seed();
    this.logger.debug('Successfuly completed seeding ItemCategory...');

    await this.itemPropertySeeder.seed();
    this.logger.debug('Successfuly completed seeding ItemProperty...');
  }
}
