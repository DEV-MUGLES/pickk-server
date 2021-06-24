import faker from 'faker';
import { Injectable } from '@nestjs/common';

import { CreateBrandInput } from '@item/brands/dtos/brand.input';
import { Brand } from '@item/brands/models/brand.model';
import { BrandsService } from '@item/brands/brands.service';

@Injectable()
export class BrandsSeeder {
  constructor(private brandsService: BrandsService) {}

  async create(): Promise<Brand> {
    const createInput: CreateBrandInput = {
      nameKor: faker.company.companyName(),
      nameEng: faker.company.bsNoun(),
      description: faker.company.catchPhrase(),
      imageUrl: faker.image.business(),
    };

    return this.brandsService.create(createInput);
  }
}
