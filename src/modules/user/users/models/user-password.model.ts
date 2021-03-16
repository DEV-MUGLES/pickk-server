import bcrypt from 'bcryptjs';

import { ObjectType } from '@nestjs/graphql';
import { UserPasswordEntity } from '../entities/user-password.entity';
import { UserPasswordInvalidException } from '../exceptions/user.exception';

@ObjectType()
export class UserPassword extends UserPasswordEntity {
  public static minLength = 8;
  public static validRegex = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_=(),./:;{}[\]|\\<>-]).{8,}$/;

  public static create(password: string): UserPassword {
    if (!this.validate(password)) {
      throw new UserPasswordInvalidException();
    }

    const salt = bcrypt.genSaltSync();
    return new UserPassword({
      salt,
      encrypted: bcrypt.hashSync(password, salt),
      createdAt: new Date(),
    });
  }

  public static validate(password: string): boolean {
    if (typeof password !== 'string') {
      return false;
    }

    return password.match(this.validRegex) !== null;
  }

  constructor(attributes?: UserPasswordEntity) {
    super();
    if (!attributes) {
      return;
    }
    this.salt = attributes.salt;
    this.encrypted = attributes.encrypted;
    this.createdAt = attributes.createdAt;
  }

  public compare(password: string): boolean {
    return bcrypt.compareSync(password, this.encrypted);
  }
}
