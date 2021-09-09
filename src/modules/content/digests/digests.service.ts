import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { bulkEnrichUserIsMe, enrichIsMine, parseFilter } from '@common/helpers';
import { CacheService } from '@providers/cache/redis';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';
import { FollowsService } from '@user/follows/follows.service';
import { ItemPropertiesService } from '@item/item-properties/item-properties.service';

import { DigestRelationType } from './constants';
import { CreateDigestInput, DigestFilter, UpdateDigestInput } from './dtos';
import { Digest, DigestImage } from './models';
import { DigestFactory } from './factories';
import { DigestsProducer } from './producers';

import { DigestsRepository } from './digests.repository';
import { DigestEntity } from './entities';

@Injectable()
export class DigestsService {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
    private readonly likesService: LikesService,
    private readonly followsService: FollowsService,
    private readonly cacheService: CacheService,
    private readonly itemPropertiesService: ItemPropertiesService,
    private readonly digestsProducer: DigestsProducer
  ) {}

  async checkBelongsTo(id: number, userId: number): Promise<void> {
    const isMine = await this.digestsRepository.checkBelongsTo(id, userId);
    if (!isMine) {
      throw new ForbiddenException('자신의 Digest가 아닙니다.');
    }
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
    const digests = this.digestsRepository.entityToModelMany(
      await this.digestsRepository.find({
        relations,
        ...(await this.getFindOptions(filter, pageInput)),
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

  private async getFindOptions(
    filter?: DigestFilter,
    pageInput?: PageInput
  ): Promise<FindManyOptions<DigestEntity>> {
    const _filter = plainToClass(DigestFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    if (_filter?.hasCustom) {
      const ids = await this.findIds(_filter, _pageInput);

      return {
        where: { id: In(ids) },
        order: {
          [filter?.orderBy ?? 'id']: 'DESC',
        },
      };
    }

    return {
      where: parseFilter(_filter, _pageInput?.idFilter),
      ...(_pageInput?.pageFilter ?? {}),
      order: {
        [filter?.orderBy ?? 'id']: 'DESC',
      },
    };
  }

  private async findIds(
    filter: DigestFilter,
    pageInput: PageInput
  ): Promise<number[]> {
    const cacheKey = `digest-ids:${filter.cacheKey}:${JSON.stringify(
      pageInput
    )}`;
    const cached = await this.cacheService.get<number[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await this.digestsRepository.findIds(filter, pageInput);

    await this.cacheService.set<number[]>(cacheKey, result, { ttl: 60 });
    return result;
  }

  async remove(id: number): Promise<void> {
    const digest = await this.get(id);
    await this.digestsRepository.remove(digest);
    await this.digestsProducer.updateItemDigestStatistics(digest.itemId);
  }

  async create(userId: number, input: CreateDigestInput): Promise<Digest> {
    const itemPropertyValues = await this.itemPropertiesService.findValuesByIds(
      input.itemPropertyValueIds
    );
    const digest = await this.digestsRepository.save(
      DigestFactory.from(
        { ...input, itemPropertyValues, userId },
        input.imageUrls
      )
    );
    await this.digestsProducer.updateItemDigestStatistics(digest.itemId);
    return digest;
  }

  // TODO: QUEUE deletedImages 제거하는 큐 작업 추가
  async update(id: number, input: UpdateDigestInput): Promise<DigestImage[]> {
    const digest = await this.get(id, ['images']);
    const itemPropertyValues = await this.itemPropertiesService.findValuesByIds(
      input.itemPropertyValueIds
    );
    const updatedDigest = DigestFactory.from(
      { ...digest, ...input, itemPropertyValues },
      input.imageUrls
    );
    const deletedImages = digest.images.filter(
      ({ key }) => !updatedDigest.images.find((image) => image.key === key)
    );

    await this.digestsRepository.save(updatedDigest);
    return deletedImages;
  }
}
