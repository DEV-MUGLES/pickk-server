import { ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';

@ObjectType()
export class User extends UserEntity {}
