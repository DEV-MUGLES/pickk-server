import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';

import { LikeOwnerType } from '@content/likes/constants';
import { LikesService } from '@content/likes/likes.service';

import { DigestRelationType } from './constants';
import { DigestFilter } from './dtos';
import { Digest } from './models';

import { DigestsRepository } from './digests.repository';

@Injectable()
export class DigestsService {
  constructor(
    @Inject(LikesService) private readonly likesService: LikesService,
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository
  ) {}

  async get(id: number, relations: DigestRelationType[] = []): Promise<Digest> {
    return await this.digestsRepository.get(id, relations);
  }

  async list(
    filter?: DigestFilter,
    pageInput?: PageInput,
    relations: DigestRelationType[] = [],
    userId?: number
  ): Promise<Digest[]> {
    const _filter = plainToClass(DigestFilter, filter);
    const _pageInput = plainToClass(PageInput, pageInput);

    const digests = await this.digestsRepository.entityToModelMany(
      await this.digestsRepository.find({
        relations,
        where: parseFilter(_filter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
      })
    );

    //@TODO: 리팩토링
    if (userId) {
      const existMap = await this.likesService.bulkCheck(
        userId,
        LikeOwnerType.Digest,
        digests.map((digest) => digest.id)
      );

      for (const digest of digests) {
        digest.isLiking = existMap.get(digest.id);
      }
    }

    return digests;
  }
}
