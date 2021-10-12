import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { User } from '@user/users/models';

import { UserAppInstallLogEntity } from '../entities';

@ObjectType()
export class UserAppInstallLog extends UserAppInstallLogEntity {
  @Field(() => User)
  @Type(() => User)
  user: User;
}
