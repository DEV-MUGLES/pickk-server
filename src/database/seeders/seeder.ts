import { Injectable, Logger } from '@nestjs/common';

import { ItemSeeder } from './item/item.seeder';
import { UsersSeeder } from './user/users.seeder';

@Injectable()
export class Seeder {
  constructor(
    private readonly itemSeeder: ItemSeeder,
    private readonly usersSeeder: UsersSeeder,
    private readonly logger: Logger
  ) {}

  async seed() {
    const users = await this.usersSeeder.create();
    const userIds = users.map((user) => user.id);
    this.logger.debug('Successfuly completed seeding users...');

    await this.itemSeeder.createBrandCourierSeller(userIds);
    this.logger.debug('Successfuly completed seeding BrandCourierSeller...');

    await this.itemSeeder.createItemProduct();
    this.logger.debug('Successfuly completed seeding ItemProduct...');
  }
}
