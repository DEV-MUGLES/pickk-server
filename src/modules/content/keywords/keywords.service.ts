import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { LookFilter } from '@content/looks/dtos';
import { CacheService } from '@providers/cache/redis';

import { KeywordRelationType } from './constants';
import { KeywordFilter } from './dtos';
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
    filter?: KeywordFilter,
    pageInput?: PageInput,
    relations: KeywordRelationType[] = []
  ): Promise<Keyword[]> {
    const _filter = plainToClass(LookFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.keywordsRepository.entityToModelMany(
      await this.keywordsRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async countByClass(classId: number) {
    const cacheKey = KeywordClass.keywordCountCacheKey(classId);
    const cached = await this.cacheService.get<number>(cacheKey);
    if (cached) {
      return cached;
    }

    return await this.keywordsRepository.countByClass(classId);
  }
}
