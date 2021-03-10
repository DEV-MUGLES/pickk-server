import bcrypt from 'bcrypt';

import { ObjectType } from '@nestjs/graphql';
import { UserPasswordEntity } from '../entities/user-password.entity';

@ObjectType()
export class UserPassword extends UserPasswordEntity {
  constructor(input: string) {
    super();

    this.salt = bcrypt.genSaltSync();
    this.encrypted = bcrypt.hashSync(input, this.salt);
    this.createdAt = new Date();
  }

  public compare(password: string): boolean {
    return bcrypt.compareSync(password, this.encrypted);
  }
}
