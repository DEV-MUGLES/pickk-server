import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BrandsRepository } from './brands.repository';
import { CreateBrandInput, UpdateBrandInput } from './dto/brand.input';
import { Brand } from './models/brand.model';

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

  async create(createBrandInput: CreateBrandInput): Promise<Brand> {
    const courier = new Brand(createBrandInput);
    return await this.brandsRepository.save(courier);
  }

  async update(id: number, input: UpdateBrandInput): Promise<Brand> {
    await this.brandsRepository.update(id, input);
    return await this.get(id);
  }
}
