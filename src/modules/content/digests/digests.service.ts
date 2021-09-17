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
import { DigestFactory, DigestImageFactory } from './factories';
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

  async likingListByIds(
    ids: number[],
    relations: DigestRelationType[] = [],
    userId: number
  ): Promise<Digest[]> {
    const digests = this.digestsRepository.entityToModelMany(
      await this.digestsRepository.find({
        relations,
        where: {
          id: In(ids),
        },
      })
    );

    for (const digest of digests) {
      digest.isLiking = true;
    }
    await this.followsService.bulkEnrichAuthorFollowing(userId, digests);
    bulkEnrichUserIsMe(userId, digests);

    return ids
      .map((id) => digests.find((digest) => digest.id === id))
      .filter((digest) => digest != null);
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

  async update(id: number, input: UpdateDigestInput): Promise<Digest> {
    const digest = await this.get(id, ['images', 'itemPropertyValues']);
    const { images: digestImages } = digest;

    if (input.itemPropertyValueIds) {
      digest.itemPropertyValues =
        await this.itemPropertiesService.findValuesByIds(
          input.itemPropertyValueIds
        );
    }
    if (input.imageUrls) {
      digest.images = input.imageUrls.map((url, order) =>
        DigestImageFactory.from(url, order)
      );
    }

    const updatedDigest = await this.digestsRepository.save(
      new Digest({
        ...digest,
        ...input,
      })
    );
    await this.removeDeletedDigestImages(digestImages, updatedDigest.images);
    return updatedDigest;
  }

  private async removeDeletedDigestImages(
    images: DigestImage[],
    updatedImages: DigestImage[]
  ) {
    const deletedImageKeys = images
      .filter((image) => !updatedImages.find(({ key }) => image.key === key))
      .map(({ key }) => key);
    await this.digestsProducer.removeDigestImages(deletedImageKeys);
  }
}
