import { ObjectType } from '@nestjs/graphql';
import { UserPasswordEntity } from '../entities/user-password.entity';

@ObjectType()
export class UserPassword extends UserPasswordEntity {}
