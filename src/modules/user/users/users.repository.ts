import { EntityRepository, getConnection } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';
import { UserEntity } from './entities/user.entity';
import { User } from './models/user.model';

@EntityRepository(UserEntity)
export class UsersRepository extends BaseRepository<UserEntity, User> {
  async bulkInsert(nicknames: string[]): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values(nicknames.map((nickname, idx) => ({ id: idx, nickname })))
      .execute();
  }

  entityToModel(entity: UserEntity, transformOptions = {}): User {
    return plainToClass(User, entity, transformOptions) as User;
  }

  entityToModelMany(entities: UserEntity[], transformOptions = {}): User[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
