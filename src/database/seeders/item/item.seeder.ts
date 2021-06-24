import { Injectable } from '@nestjs/common';

import { Seller } from '@item/sellers/models/seller.model';
import { BrandsSeeder } from './brands.seeder';
import { CouriersSeeder } from './couriers.seeder';
import { SellersSeeder } from './sellers.seeder';

@Injectable()
export class ItemSeeder {
  constructor(
    private brandsSeeder: BrandsSeeder,
    private couriersSeeder: CouriersSeeder,
    private sellersSeeder: SellersSeeder
  ) {}

  async createSeller(userId: number): Promise<Seller> {
    const { id: brandId } = await this.brandsSeeder.create();
    const { id: courierId } = await this.couriersSeeder.create();

    return await this.sellersSeeder.create(userId, brandId, courierId);
  }
}
