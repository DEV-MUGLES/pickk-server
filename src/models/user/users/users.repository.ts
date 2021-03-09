import { EntityRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { BaseRepository } from '../../../common/base.repository';

@EntityRepository(User)
export class UsersRepository extends BaseRepository<User> {}
