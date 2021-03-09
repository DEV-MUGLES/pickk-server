import { EntityRepository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BaseRepository } from '../../../common/base.repository';
import { User } from './models/user.model';

@EntityRepository(UserEntity)
export class UsersRepository extends BaseRepository<UserEntity, User> {}
