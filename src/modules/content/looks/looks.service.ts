import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import {
  enrichIsMine,
  enrichUserIsMe,
  findModelById,
  parseFilter,
} from '@common/helpers';
import { CacheService } from '@providers/cache/redis';

import { DigestFactory } from '@content/digests/factories';
import { DigestsProducer } from '@content/digests/producers';
import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';
import { StyleTagsService } from '@content/style-tags/style-tags.service';
import { FollowsService } from '@user/follows/follows.service';

import { LookRelationType } from './constants';
import { CreateLookInput, LookFilter, UpdateLookInput } from './dtos';
import { LookEntity } from './entities';
import { LookFactory, LookImageFactory } from './factories';
import { Look } from './models';

import { LooksRepository } from './looks.repository';

@Injectable()
export class LooksService {
  constructor(
    @InjectRepository(LooksRepository)
    private readonly looksRepository: LooksRepository,
    private readonly likesService: LikesService,
    private readonly followsService: FollowsService,
    private readonly cacheService: CacheService,
    private readonly styleTagsService: StyleTagsService,
    private readonly digestsProducer: DigestsProducer
  ) {}

  async checkBelongsTo(id: number, userId: number): Promise<void> {
    const isMine = await this.looksRepository.checkBelongsTo(id, userId);
    if (!isMine) {
      throw new ForbiddenException('자신의 게시물이 아닙니다.');
    }
  }

  async get(
    id: number,
    relations: LookRelationType[] = [],
    userId?: number
  ): Promise<Look> {
    const look = await this.looksRepository.get(id, relations);

    if (userId) {
      enrichIsMine(userId, look);
      enrichUserIsMe(userId, look);
      await this.likesService.enrichLiking(userId, LikeOwnerType.Look, look);
      await this.followsService.enrichAuthorFollowing(userId, look);
    }

    return look;
  }

  async list(
    filter?: LookFilter,
    pageInput?: PageInput,
    relations: LookRelationType[] = []
  ): Promise<Look[]> {
    return this.looksRepository.entityToModelMany(
      await this.looksRepository.find({
        relations,
        ...(await this.getFindOptions(filter, pageInput)),
      })
    );
  }

  private async getFindOptions(
    filter?: LookFilter,
    pageInput?: PageInput
  ): Promise<FindManyOptions<LookEntity>> {
    const _filter = plainToClass(LookFilter, filter);
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
    filter: LookFilter,
    pageInput: PageInput
  ): Promise<number[]> {
    const cacheKey = `look-ids:${filter.cacheKey}:${JSON.stringify(pageInput)}`;
    const cached = await this.cacheService.get<number[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await this.looksRepository.findIds(filter, pageInput);

    await this.cacheService.set<number[]>(cacheKey, result, { ttl: 60 });
    return result;
  }

  async create(userId: number, input: CreateLookInput): Promise<Look> {
    const styleTags = await this.styleTagsService.findByIds(input.styleTagIds);

    const look = LookFactory.from(userId, input, styleTags);
    return await this.looksRepository.save(look);
  }

  // TODO: QUEUE 삭제된 look_image 삭제하는 작업 추가
  async update(id: number, input: UpdateLookInput): Promise<Look> {
    const look = await this.get(id, ['digests', 'images', 'styleTags']);
    const { digests: lookDigests } = look;

    if (input.digests) {
      look.digests = input.digests.map((digest) =>
        DigestFactory.from({
          ...look.digests.find((v) => v.id === digest.id),
          ...digest,
        })
      );
    }
    if (input.styleTagIds) {
      look.styleTags = await this.styleTagsService.findByIds(input.styleTagIds);
    }
    if (input.imageUrls) {
      look.images = input.imageUrls.map((url, order) =>
        LookImageFactory.from(url, order)
      );
    }

    const updatedLook = await this.looksRepository.save(
      new Look({
        ...look,
        ...input,
        digests: look.digests,
      })
    );
    await this.digestsProducer.removeDigests(
      lookDigests.filter((v) => !findModelById(v.id, updatedLook.digests))
    );
    return updatedLook;
  }

  async remove(id: number): Promise<void> {
    const look = await this.get(id, ['digests']);
    await this.looksRepository.remove(look);
    // look의 digest는 모두 꿀템PICK이 아니기 때문에 digestsProducer.updateItemDigestStatistics는 필요 없다.
    // @TODO: 이미지들 S3에서 삭제
  }
}
