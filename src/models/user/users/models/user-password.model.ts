import bcrypt from 'bcryptjs';

import { ObjectType } from '@nestjs/graphql';
import { UserPasswordEntity } from '../entities/user-password.entity';

@ObjectType()
export class UserPassword extends UserPasswordEntity {
  constructor(attributes?: UserPasswordEntity) {
    super();
    if (!attributes) {
      return;
    }
    this.salt = attributes.salt;
    this.encrypted = attributes.encrypted;
    this.createdAt = attributes.createdAt;
  }

  public static create(password: string): UserPassword {
    const salt = bcrypt.genSaltSync();
    return new UserPassword({
      salt,
      encrypted: bcrypt.hashSync(password, salt),
      createdAt: new Date(),
    });
  }

  public compare(password: string): boolean {
    return bcrypt.compareSync(password, this.encrypted);
  }
}
