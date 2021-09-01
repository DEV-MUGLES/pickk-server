import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { enrichIsMine, parseFilter } from '@common/helpers';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';
import { FollowsService } from '@user/follows/follows.service';

import { LookRelationType } from './constants';
import { LookFilter } from './dtos';
import { LookEntity } from './entities';
import { Look } from './models';

import { LooksRepository } from './looks.repository';

@Injectable()
export class LooksService {
  constructor(
    @InjectRepository(LooksRepository)
    private readonly looksRepository: LooksRepository,
    private readonly likesService: LikesService,
    private readonly followsService: FollowsService
  ) {}

  async get(
    id: number,
    relations: LookRelationType[] = [],
    userId?: number
  ): Promise<Look> {
    const look = await this.looksRepository.get(id, relations);

    if (userId) {
      enrichIsMine(userId, look);
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

    if (_filter?.styleTagIdIn?.length > 0) {
      const ids = await this.looksRepository.findIdsByStyleTags(
        _filter,
        _pageInput
      );

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
}
