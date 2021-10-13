import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOperator, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { bulkEnrichUserIsMe, parseFilter } from '@common/helpers';
import { CacheService } from '@providers/cache/redis';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';
import { FollowsService } from '@user/follows/follows.service';

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
    private readonly cacheService: CacheService,
    private readonly followsService: FollowsService
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
      if (keyword.digests) {
        await this.likesService.bulkEnrichLiking(
          userId,
          LikeOwnerType.Digest,
          keyword.digests
        );
        await this.followsService.bulkEnrichAuthorFollowing(
          userId,
          keyword.digests
        );
        bulkEnrichUserIsMe(userId, keyword.digests);
      }
    }

    return keyword;
  }

  async list(
    filter: KeywordFilter,
    pageInput?: PageInput,
    relations: KeywordRelationType[] = [],
    userId?: number
  ): Promise<Keyword[]> {
    if (!userId && (filter?.isLiking === true || filter?.isOwning === true)) {
      return [];
    }

    const keywords = this.keywordsRepository.entityToModelMany(
      await this.keywordsRepository.find({
        relations,
        where: await this.getFindWhere(filter, pageInput, userId),
        order: {
          [filter?.orderBy ?? 'id']: 'DESC',
        },
      })
    );

    if (filter?.isLiking != null && userId) {
      for (const keyword of keywords) {
        keyword.isLiking = filter?.isLiking;
      }
    }
    if (filter?.isOwning != null && userId) {
      for (const keyword of keywords) {
        keyword.isOwning = filter?.isOwning;
      }
    }

    return keywords;
  }

  // @TODO: list 메소드와 원만히 합치기
  async likingListByIds(
    ids: number[],
    relations: KeywordRelationType[] = []
  ): Promise<Keyword[]> {
    const keywords = this.keywordsRepository.entityToModelMany(
      await this.keywordsRepository.find({
        relations,
        where: {
          id: In(ids),
        },
      })
    );

    for (const keyword of keywords) {
      keyword.isLiking = true;
    }
    return ids
      .map((id) => keywords.find((keyword) => keyword.id === id))
      .filter((keyword) => keyword != null);
  }

  private async getFindWhere(
    filter: KeywordFilter,
    pageInput?: PageInput,
    userId?: number
  ): Promise<FindManyOptions<KeywordEntity>['where']> {
    const _filter = plainToClass(KeywordFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    if (_filter?.hasCustom) {
      if (
        _filter.keywordClassIdIn &&
        _filter.isLiking == null &&
        _filter.isOwning == null
      ) {
        return await this.getCachedIdsWhere(filter, pageInput);
      }

      const ids = await this.keywordsRepository.findIds(
        _filter,
        _pageInput,
        userId
      );

      return { id: In(ids) };
    }

    return parseFilter(_filter, _pageInput?.idFilter);
  }

  async getCachedIdsWhere(
    filter: KeywordFilter,
    pageInput?: PageInput
  ): Promise<{ id: FindOperator<number> }> {
    const cacheKey = `keyword-ids:${filter.keywordClassIdIn.join(
      ','
    )}:${JSON.stringify(pageInput)}`;
    const cached = await this.cacheService.get<number[]>(cacheKey);

    if (cached) {
      return { id: In(cached) };
    }

    const ids = await this.keywordsRepository.findIds(filter, pageInput);
    await this.cacheService.set<number[]>(cacheKey, ids, { ttl: 60 });

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
}
