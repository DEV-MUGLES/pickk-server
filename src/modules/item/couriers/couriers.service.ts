import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CouriersRepository } from './couriers.repository';
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
}
