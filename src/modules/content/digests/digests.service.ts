import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { bulkEnrichUserIsMe, enrichIsMine, parseFilter } from '@common/helpers';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';
import { FollowsService } from '@user/follows/follows.service';

import { DigestRelationType } from './constants';
import { DigestFilter } from './dtos';
import { Digest } from './models';

import { DigestsRepository } from './digests.repository';

@Injectable()
export class DigestsService {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
    private readonly likesService: LikesService,
    private readonly followsService: FollowsService
  ) {}

  async checkBelongsTo(id: number, userId: number): Promise<boolean> {
    return await this.digestsRepository.checkBelongsTo(id, userId);
  }

  async get(
    id: number,
    relations: DigestRelationType[] = [],
    userId?: number
  ): Promise<Digest> {
    const digest = await this.digestsRepository.get(id, relations);

    if (userId) {
      enrichIsMine(userId, digest);
      await this.likesService.enrichLiking(
        userId,
        LikeOwnerType.Digest,
        digest
      );
      await this.followsService.enrichAuthorFollowing(userId, digest);
    }

    return digest;
  }

  async list(
    filter?: DigestFilter,
    pageInput?: PageInput,
    relations: DigestRelationType[] = [],
    userId?: number
  ): Promise<Digest[]> {
    const _filter = plainToClass(DigestFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    const digests = this.digestsRepository.entityToModelMany(
      await this.digestsRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
        order: {
          [filter.orderBy ?? 'id']: 'DESC',
        },
      })
    );

    await this.likesService.bulkEnrichLiking(
      userId,
      LikeOwnerType.Digest,
      digests
    );
    await this.followsService.bulkEnrichAuthorFollowing(userId, digests);
    bulkEnrichUserIsMe(userId, digests);

    return digests;
  }

  async remove(id: number): Promise<void> {
    const digest = await this.get(id);
    await this.digestsRepository.remove(digest);
  }
}
