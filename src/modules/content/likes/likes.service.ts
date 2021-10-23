import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos';

import { Comment } from '@content/comments/models';

import { LikeOwnerType } from './constants';
import { Like } from './models';
import { LikeProducer } from './producers';

import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikesRepository)
    private readonly likesRepository: LikesRepository,
    private readonly likeProducer: LikeProducer
  ) {}

  async findOwnerIds(
    userId: number,
    ownerType: LikeOwnerType,
    pageInput: PageInput
  ): Promise<number[]> {
    const _pageInput = plainToClass(PageInput, pageInput);

    const likes = await this.likesRepository.find({
      select: ['ownerId'],
      where: {
        userId,
        ownerType,
      },
      ..._pageInput?.pageFilter,
      order: {
        id: 'DESC',
      },
    });

    return likes.map((v) => v.ownerId);
  }

  async check(
    userId: number,
    ownerType: LikeOwnerType,
    ownerId: number
  ): Promise<boolean> {
    return await this.likesRepository.checkExist(userId, ownerType, ownerId);
  }

  async bulkCheck(
    userId: number,
    ownerType: LikeOwnerType,
    ownerIds: number[]
  ): Promise<Map<number, boolean>> {
    return await this.likesRepository.bulkCheckExist(
      userId,
      ownerType,
      ownerIds
    );
  }

  async enrichLiking<T extends { id: number; isLiking: boolean }>(
    userId: number,
    ownerType: LikeOwnerType,
    owner: T
  ): Promise<void> {
    if (!userId) {
      return;
    }

    owner.isLiking = await this.check(userId, ownerType, owner.id);
  }

  async bulkEnrichLiking<T extends { id: number; isLiking: boolean }>(
    userId: number,
    ownerType: LikeOwnerType,
    owners: T[]
  ): Promise<void> {
    if (!userId) {
      return;
    }

    const existMap = await this.bulkCheck(
      userId,
      ownerType,
      owners.map(({ id }) => id)
    );

    for (const owner of owners) {
      owner.isLiking = existMap.get(owner.id);
    }
  }

  async bulkEnrichCommentLiking(
    userId: number,
    comments: Comment[]
  ): Promise<void> {
    if (!userId) {
      return;
    }

    const existMap = await this.bulkCheck(
      userId,
      LikeOwnerType.Comment,
      comments.reduce(
        (acc, { id, replies }) => [
          ...acc,
          id,
          ...(replies?.map((v) => v.id) ?? []),
        ],
        []
      )
    );

    for (const owner of comments) {
      owner.isLiking = existMap.get(owner.id);
      if (!owner.replies) {
        continue;
      }

      for (const reply of owner.replies) {
        reply.isLiking = existMap.get(reply.id);
      }
    }
  }

  async add(
    userId: number,
    ownerType: LikeOwnerType,
    ownerId: number
  ): Promise<void> {
    if (await this.check(userId, ownerType, ownerId)) {
      throw new ConflictException('이미 좋아요했습니다.');
    }

    await this.likesRepository.save(new Like({ userId, ownerType, ownerId }));
    await this.produceUpdateOwnerLikeCount(ownerType, ownerId);
  }

  async remove(
    userId: number,
    ownerType: LikeOwnerType,
    ownerId: number
  ): Promise<void> {
    const likes = await this.likesRepository.find({
      where: { userId, ownerType, ownerId },
    });
    if (likes.length === 0) {
      throw new NotFoundException('취소할 좋아요가 존재하지 않습니다.');
    }

    await this.likesRepository.remove(likes);
    await this.produceUpdateOwnerLikeCount(ownerType, ownerId);
  }

  async count(ownerType: LikeOwnerType, ownerId: number): Promise<number> {
    return await this.likesRepository.count({ where: { ownerType, ownerId } });
  }

  async produceUpdateOwnerLikeCount(ownerType: LikeOwnerType, ownerId: number) {
    await this.likeProducer.updateOwnerLikeCount(ownerType, {
      id: ownerId,
    });
  }
}
