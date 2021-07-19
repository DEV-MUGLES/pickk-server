import { NotFoundException } from '@nestjs/common';
import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { UserEntity } from './entities';
import { User } from './models';

@EntityRepository(UserEntity)
export class UsersRepository extends BaseRepository<UserEntity, User> {
  entityToModel(entity: UserEntity, transformOptions = {}): User {
    return plainToClass(User, entity, transformOptions) as User;
  }

  entityToModelMany(entities: UserEntity[], transformOptions = {}): User[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async checkExist(nickname: string): Promise<boolean> {
    const result = await this.createQueryBuilder('user')
      .select('1')
      .where('user.nickname = :nickname', { nickname })
      .take(1)
      .limit(1)
      .execute();
    return result?.length > 0;
  }

  async getNicknameOnly(id: number): Promise<Pick<User, 'id' | 'nickname'>> {
    return await this.findOne({
      where: { id },
      select: ['id', 'nickname'],
    }).then((entity) => {
      if (!this.isEntity(entity)) {
        throw new NotFoundException('Model not found.');
      }

      return Promise.resolve(this.entityToModel(entity));
    });
  }
}
