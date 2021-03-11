import { EntityRepository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BaseRepository } from '../../../common/base.repository';
import { User } from './models/user.model';
import { plainToClass } from 'class-transformer';

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
}
