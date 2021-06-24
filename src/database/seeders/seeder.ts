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
      const { id: userId } = await this.usersSeeder.create();
      await this.itemSeeder.createSeller(userId);
    } catch (err) {
      throw new Error(err);
    }
  }
}
