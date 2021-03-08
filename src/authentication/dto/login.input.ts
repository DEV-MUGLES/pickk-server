import { InputType, PickType } from '@nestjs/graphql';
import { User } from '@src/modules/user/users/models/user.model';

@InputType()
export class LoginByEmailInput extends PickType(
  User,
  ['email', 'password'],
  InputType
) {}

@InputType()
export class LoginByCodeInput extends PickType(
  User,
  ['code', 'password'],
  InputType
) {}
