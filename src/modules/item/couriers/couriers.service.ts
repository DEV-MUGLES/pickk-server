import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CouriersRepository } from './couriers.repository';
import { CreateCourierInput, UpdateCourierInput } from './dto/courier.input';
import { Courier } from './models/courier.model';

@Injectable()
export class CouriersService {
  constructor(
    @InjectRepository(CouriersRepository)
    private readonly couriersRepository: CouriersRepository
  ) {}

  async list(relations: string[] = []): Promise<Courier[]> {
    const couriers = await this.couriersRepository.find({ relations });
    return this.couriersRepository.entityToModelMany(couriers);
  }

  async get(id: number, relations: string[] = []): Promise<Courier> {
    return await this.couriersRepository.get(id, relations);
  }

  async create(createCourierInput: CreateCourierInput): Promise<Courier> {
    const courier = new Courier(createCourierInput);
    return await this.couriersRepository.save(courier);
  }

  async update(id: number, input: UpdateCourierInput): Promise<Courier> {
    await this.couriersRepository.update(id, input);
    return await this.get(id);
  }
}
