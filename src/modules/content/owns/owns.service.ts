import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CacheService } from '@providers/cache/redis';

import { Own } from './models';

import { OwnsRepository } from './owns.repository';

@Injectable()
export class OwnsService {
  constructor(
    @InjectRepository(OwnsRepository)
    private readonly ownsRepository: OwnsRepository,
    @Inject(CacheService) private cacheService: CacheService
  ) {}

  private getCountCacheKey(userId: number, keywordClassId: number): string {
    return Own.countCacheKey(userId, keywordClassId);
  }

  async check(userId: number, keywordId: number): Promise<boolean> {
    return await this.ownsRepository.checkExist(userId, keywordId);
  }

  async add(
    userId: number,
    keywordId: number,
    // @TODO: increase count task에서 사용 예정
    keywordClassId: number
  ): Promise<void> {
    if (await this.check(userId, keywordId)) {
      throw new ConflictException('이미 보유중입니다.');
    }

    await this.ownsRepository.save(new Own({ userId, keywordId }));
    // @TODO: increase count task를 produce
  }

  async remove(
    userId: number,
    keywordId: number,
    // @TODO: decrease count task에서 사용 예정
    keywordClassId: number
  ): Promise<void> {
    const owns = await this.ownsRepository.find({
      where: { userId, keywordId },
    });
    if (owns.length === 0) {
      throw new NotFoundException('보유중이지 않습니다.');
    }

    await this.ownsRepository.remove(owns);
    // @TODO: decrease count task를 produce. 이때 1만 감소시켜도 상관 없다.
  }

  async getCount(userId: number, keywordClassId: number): Promise<number> {
    const cached = await this.cacheService.get<number>(
      this.getCountCacheKey(userId, keywordClassId)
    );
    if (cached) {
      return cached;
    }

    return await this.ownsRepository.countByClass(userId, keywordClassId);
  }

  async increaseCount(userId: number, keywordClassId: number): Promise<void> {
    const count = await this.getCount(userId, keywordClassId);
    await this.cacheService.set<number>(
      this.getCountCacheKey(userId, keywordClassId),
      count + 1
    );
  }

  async decreaseCount(userId: number, keywordClassId: number): Promise<void> {
    const count = await this.getCount(userId, keywordClassId);
    if (count <= 0) {
      throw new BadRequestException('이미 0개를 보유중입니다.');
    }

    await this.cacheService.set<number>(
      this.getCountCacheKey(userId, keywordClassId),
      (count ?? 0) - 1
    );
  }
}
