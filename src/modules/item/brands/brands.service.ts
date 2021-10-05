import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBrandInput, UpdateBrandInput } from './dtos';
import { Brand } from './models';

import { BrandsRepository } from './brands.repository';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(BrandsRepository)
    private readonly brandsRepository: BrandsRepository
  ) {}

  async list(relations: string[] = []): Promise<Brand[]> {
    const couriers = await this.brandsRepository.find({ relations });
    return this.brandsRepository.entityToModelMany(couriers);
  }

  async get(id: number, relations: string[] = []): Promise<Brand> {
    return await this.brandsRepository.get(id, relations);
  }

  async create(input: CreateBrandInput): Promise<Brand> {
    return await this.brandsRepository.save(new Brand(input));
  }

  async getOrCreate(input: CreateBrandInput): Promise<Brand> {
    const existing = await this.brandsRepository.findOneEntity(input);
    if (existing) {
      return existing;
    }

    return await this.create(input);
  }

  async update(id: number, input: UpdateBrandInput): Promise<Brand> {
    const brand = await this.get(id);
    return await this.brandsRepository.save(new Brand({ ...brand, ...input }));
  }
}
