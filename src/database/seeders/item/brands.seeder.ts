import faker from 'faker';
import { Injectable } from '@nestjs/common';

import { CreateBrandInput } from '@item/brands/dtos/brand.input';
import { BrandsService } from '@item/brands/brands.service';
import { Brand } from '@item/brands/models/brand.model';
import { BRAND_COUNT } from '../data';

@Injectable()
export class BrandsSeeder {
  constructor(private brandsService: BrandsService) {}

  createBrandInputs(): CreateBrandInput[] {
    return [...Array(BRAND_COUNT)].map(() => ({
      nameKor: faker.company.companyName().slice(0, 10),
      nameEng: faker.company.companyName().slice(0, 10),
      description: faker.company.catchPhrase(),
      imageUrl: faker.image.business(),
    }));
  }

  async create(): Promise<Brand[]> {
    return await Promise.all(
      this.createBrandInputs().map((brandInput) =>
        this.brandsService.create(brandInput)
      )
    );
  }
}
