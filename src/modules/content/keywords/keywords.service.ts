import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
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
    private cacheService: CacheService
  ) {}

  async get(id: number, relations: KeywordRelationType[] = []) {
    return await this.keywordsRepository.get(id, relations);
  }

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
    const _filter = plainToClass(KeywordFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    if (!_filter.keywordClassId) {
      return parseFilter(_filter, _pageInput?.idFilter);
    }

    const ids = await this.keywordsRepository.findIdsByClass(
      _filter.keywordClassId,
      userId,
      _filter.isOwning,
      _pageInput
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
