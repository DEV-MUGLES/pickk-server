import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { CacheService } from '@providers/cache/redis';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';

import { KeywordRelationType } from './constants';
import { KeywordClassFilter, KeywordFilter } from './dtos';
import { KeywordEntity } from './entities';
import { Keyword, KeywordClass } from './models';

import {
  KeywordClassesRepository,
  KeywordsRepository,
} from './keywords.repository';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(KeywordsRepository)
    private readonly keywordsRepository: KeywordsRepository,
    @InjectRepository(KeywordClassesRepository)
    private readonly keywordClassesRepository: KeywordClassesRepository,
    private readonly likesService: LikesService,
    private cacheService: CacheService
  ) {}

  async get(
    id: number,
    relations: KeywordRelationType[] = [],
    userId?: number
  ) {
    const keyword = await this.keywordsRepository.get(id, relations);

    if (userId) {
      await this.likesService.enrichLiking(
        userId,
        LikeOwnerType.Keyword,
        keyword
      );
    }

    return keyword;
  }

  async list(
    filter: KeywordFilter,
    pageInput?: PageInput,
    relations: KeywordRelationType[] = [],
    userId?: number
  ): Promise<Keyword[]> {
    const keywords = this.keywordsRepository.entityToModelMany(
      await this.keywordsRepository.find({
        relations,
        where: await this.getFindWhere(filter, pageInput, userId),
        order: {
          score: 'DESC',
        },
      })
    );

    return keywords;
  }

  async listClasses(
    filter: KeywordClassFilter,
    pageInput?: PageInput
  ): Promise<KeywordClass[]> {
    const _filter = plainToClass(KeywordClassFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.keywordClassesRepository.entityToModelMany(
      await this.keywordClassesRepository.find({
        where: parseFilter(_filter, _pageInput?.idFilter),
        order: {
          order: 'ASC',
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
