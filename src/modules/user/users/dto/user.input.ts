import { InputType, PartialType, PickType, OmitType } from '@nestjs/graphql';

import { User } from '../models/user.model';

@InputType()
export class CreateUserInput extends PickType(
  User,
  ['code', 'email', 'name', 'password', 'weight', 'height'],
  InputType
) {}

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(User, ['createdAt', 'updatedAt'], InputType)
) {}
