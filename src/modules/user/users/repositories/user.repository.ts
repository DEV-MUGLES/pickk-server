import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';
import { UserEntity } from '../entities/user.entity';
import { User } from '../models/user.model';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity, User> {
  entityToModel(entity: UserEntity, transformOptions = {}): User {
    return plainToClass(User, entity, transformOptions) as User;
  }

  entityToModelMany(entities: UserEntity[], transformOptions = {}): User[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
