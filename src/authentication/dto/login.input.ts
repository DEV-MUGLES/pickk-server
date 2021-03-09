import { InputType, PickType } from '@nestjs/graphql';
import { UserEntity } from '@src/models/user/users/entities/user.entity';

@InputType()
export class LoginByEmailInput extends PickType(
  UserEntity,
  ['email', 'password'],
  InputType
) {}

@InputType()
export class LoginByCodeInput extends PickType(
  UserEntity,
  ['code', 'password'],
  InputType
) {}
