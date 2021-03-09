import { InputType, PartialType, PickType, OmitType } from '@nestjs/graphql';

import { UserEntity } from '../entities/user.entity';

@InputType()
export class CreateUserInput extends PickType(
  UserEntity,
  ['code', 'email', 'name', 'password', 'weight', 'height'],
  InputType
) {}

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(UserEntity, ['createdAt', 'updatedAt'], InputType)
) {}
