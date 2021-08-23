import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OwnsRepository } from './owns.repository';

@Injectable()
export class OwnsService {
  constructor(
    @InjectRepository(OwnsRepository)
    private readonly ownsRepository: OwnsRepository
  ) {}

  async check(userId: number, keywordId: number): Promise<boolean> {
    return await this.ownsRepository.checkExist(userId, keywordId);
  }
}
