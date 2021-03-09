import { InputType, PartialType, PickType, OmitType } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';

@InputType()
export class CreateUserInput extends PickType(
  UserModel,
  ['code', 'email', 'name', 'password', 'weight', 'height'],
  InputType
) {}

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(UserModel, ['createdAt', 'updatedAt'], InputType)
) {}
