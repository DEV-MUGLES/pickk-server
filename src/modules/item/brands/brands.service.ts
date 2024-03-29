import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BrandRelationType } from './constants';
import { CreateBrandInput, UpdateBrandInput } from './dtos';
import { Brand } from './models';

import { BrandsRepository } from './brands.repository';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(BrandsRepository)
    private readonly brandsRepository: BrandsRepository
  ) {}

  async list(relations: BrandRelationType[] = []): Promise<Brand[]> {
    const couriers = await this.brandsRepository.find({ relations });
    return this.brandsRepository.entityToModelMany(couriers);
  }

  async get(id: number, relations: BrandRelationType[] = []): Promise<Brand> {
    return await this.brandsRepository.get(id, relations);
  }

  async create(input: CreateBrandInput): Promise<Brand> {
    return await this.brandsRepository.save(new Brand(input));
  }

  async getOrCreate(input: CreateBrandInput): Promise<Brand> {
    const existing = this.brandsRepository.entityToModelMany(
      await this.brandsRepository.find(input)
    );
    if (existing?.length) {
      return existing[0];
    }

    return await this.create(input);
  }

  async update(id: number, input: UpdateBrandInput): Promise<Brand> {
    const brand = await this.get(id);
    return await this.brandsRepository.save(new Brand({ ...brand, ...input }));
  }
}
