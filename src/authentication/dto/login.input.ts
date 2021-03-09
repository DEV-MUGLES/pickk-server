import { InputType, PickType } from '@nestjs/graphql';
import { UserModel } from '@src/models/user/users/models/user.model';

@InputType()
export class LoginByEmailInput extends PickType(
  UserModel,
  ['email', 'password'],
  InputType
) {}

@InputType()
export class LoginByCodeInput extends PickType(
  UserModel,
  ['code', 'password'],
  InputType
) {}
