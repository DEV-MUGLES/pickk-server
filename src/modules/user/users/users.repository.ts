import { EntityRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { ModelRepository } from '../../model.repository';

@EntityRepository(User)
export class UsersRepository extends ModelRepository<User> {}
