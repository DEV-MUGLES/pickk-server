import { KeywordsService } from '@content/keywords/keywords.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CacheService } from '@providers/cache/redis';

import { OwnsCountOutput } from './dtos';
import { Own } from './models';
import { OwningCountCacheProducer } from './producers';

import { OwnsRepository } from './owns.repository';

@Injectable()
export class OwnsService {
  constructor(
    @InjectRepository(OwnsRepository)
    private readonly ownsRepository: OwnsRepository,
    private readonly keywordsService: KeywordsService,
    private readonly cacheService: CacheService,
    private readonly owningCountCacheProducer: OwningCountCacheProducer
  ) {}

  async check(userId: number, keywordId: number): Promise<boolean> {
    return await this.ownsRepository.checkExist(userId, keywordId);
  }

  async add(userId: number, keywordId: number): Promise<void> {
    if (await this.check(userId, keywordId)) {
      throw new ConflictException('이미 보유중입니다.');
    }

    await this.ownsRepository.save(new Own({ userId, keywordId }));
    await this.owningCountCacheProducer.increaseKeywordClassOwningCountCache({
      userId,
      keywordId,
    });
  }

  async remove(userId: number, keywordId: number): Promise<void> {
    const owns = await this.ownsRepository.find({
      where: { userId, keywordId },
    });
    if (owns.length === 0) {
      throw new NotFoundException('보유중이지 않습니다.');
    }

    await this.ownsRepository.remove(owns);
    await this.owningCountCacheProducer.decreaseKeywordClassOwingCountCache({
      userId,
      keywordId,
    });
  }

  async getCount(
    userId: number,
    keywordClassId: number
  ): Promise<OwnsCountOutput> {
    const total = await this.keywordsService.countByClass(keywordClassId);
    const owning = await this.getOwningCount(userId, keywordClassId);

    return OwnsCountOutput.create(userId, keywordClassId, total, owning);
  }

  private getOwningCountCacheKey(
    userId: number,
    keywordClassId: number
  ): string {
    return Own.owningCountCacheKey(userId, keywordClassId);
  }

  private async getOwningCount(
    userId: number,
    keywordClassId: number,
    isUpdatingCache = true
  ): Promise<number> {
    const cacheKey = this.getOwningCountCacheKey(userId, keywordClassId);
    const cached = Number(await this.cacheService.get<number>(cacheKey));

    if (cached) {
      return cached;
    }

    const count = await this.ownsRepository.countByClass(
      userId,
      keywordClassId
    );

    if (isUpdatingCache) {
      await this.cacheService.set<number>(cacheKey, count);
    }

    return count;
  }

  async increaseOwningCount(
    userId: number,
    keywordClassId: number
  ): Promise<void> {
    const count = await this.getOwningCount(userId, keywordClassId, false);
    await this.cacheService.set<number>(
      this.getOwningCountCacheKey(userId, keywordClassId),
      count + 1
    );
  }

  async decreaseOwningCount(
    userId: number,
    keywordClassId: number
  ): Promise<void> {
    const count = await this.getOwningCount(userId, keywordClassId, false);
    if (count <= 0) {
      throw new BadRequestException('이미 0개를 보유중입니다.');
    }

    await this.cacheService.set<number>(
      this.getOwningCountCacheKey(userId, keywordClassId),
      (count ?? 0) - 1
    );
  }
}
