import { Injectable } from '@nestjs/common';

import { ItemSeeder } from './item/item.seeder';
import { UsersSeeder } from './user/users.seeder';

@Injectable()
export class Seeder {
  constructor(
    private itemSeeder: ItemSeeder,
    private usersSeeder: UsersSeeder
  ) {}

  async seed() {
    try {
      const users = await this.usersSeeder.create();
      const userIds = users.map((user) => user.id);

      await this.itemSeeder.createBrandCourierSeller(userIds);
      await this.itemSeeder.createItemProduct();
    } catch (err) {
      throw new Error(err);
    }
  }
}
