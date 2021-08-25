import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In } from 'typeorm';

import { PageInput } from '@common/dtos';
import { CacheService } from '@providers/cache/redis';

import { KeywordRelationType } from './constants';
import { KeywordFilter } from './dtos';
import { KeywordEntity } from './entities';
import { Keyword, KeywordClass } from './models';

import { KeywordsRepository } from './keywords.repository';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(KeywordsRepository)
    private readonly keywordsRepository: KeywordsRepository,
    @Inject(CacheService) private cacheService: CacheService
  ) {}

  async list(
    filter: KeywordFilter,
    pageInput?: PageInput,
    relations: KeywordRelationType[] = [],
    userId?: number
  ): Promise<Keyword[]> {
    return this.keywordsRepository.entityToModelMany(
      await this.keywordsRepository.find({
        relations,
        where: await this.getFindWhere(filter, pageInput, userId),
        order: {
          score: 'DESC',
        },
      })
    );
  }

  private async getFindWhere(
    filter: KeywordFilter,
    pageInput?: PageInput,
    userId?: number
  ): Promise<FindManyOptions<KeywordEntity>['where']> {
    const ids = await this.keywordsRepository.findIdsByClass(
      filter.keywordClassId,
      userId,
      filter.isOwning,
      pageInput
    );

    return { id: In(ids) };
  }

  async listByClass(
    classId: number,
    userId: number,
    isOwning: boolean,
    relations: KeywordRelationType[] = [],
    pageInput?: PageInput
  ): Promise<Keyword[]> {
    const ids = await this.keywordsRepository.findIdsByClass(
      classId,
      userId,
      isOwning,
      pageInput
    );

    return this.keywordsRepository.entityToModelMany(
      await this.keywordsRepository.find({
        relations,
        where: {
          id: In(ids),
        },
        order: {
          id: 'DESC',
        },
      })
    );
  }

  async countByClass(classId: number) {
    const cacheKey = KeywordClass.keywordCountCacheKey(classId);
    const cached = await this.cacheService.get<number>(cacheKey);
    if (cached) {
      return cached;
    }

    const count = await this.keywordsRepository.countByClass(classId);
    await this.cacheService.set<number>(cacheKey, count, { ttl: 600 });
    return count;
  }

  /** 입력된 id의 키워드가 연관된 키워드 클래스들의 id를 반환합니다. */
  async getClassIds(id: number): Promise<number[]> {
    return await this.keywordsRepository.getClassIds(id);
  }
}
