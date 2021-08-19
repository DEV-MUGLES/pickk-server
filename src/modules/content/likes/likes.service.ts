import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LikeOwnerType } from './constants';
import { Like } from './models';

import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikesRepository)
    private readonly likesRepository: LikesRepository
  ) {}

  // @TODO: count 업데이트 태스크
  async add(
    userId: number,
    ownerType: LikeOwnerType,
    ownerId: number
  ): Promise<void> {
    if (await this.likesRepository.checkExist(userId, ownerType, ownerId)) {
      throw new ConflictException('이미 좋아요했습니다.');
    }

    await this.likesRepository.save(new Like({ userId, ownerType, ownerId }));
  }

  // @TODO: count 업데이트 태스크
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
  }

  async count(ownerType: LikeOwnerType, ownerId: number): Promise<number> {
    return await this.likesRepository.count({ where: { ownerType, ownerId } });
  }
}