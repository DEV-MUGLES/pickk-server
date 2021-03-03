import { EntityRepository } from 'typeorm';
import { User } from './models/user.model';
import { ModelRepository } from '../../model.repository';

@EntityRepository(User)
export class UsersRepository extends ModelRepository<User> {}
