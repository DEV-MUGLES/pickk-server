import { UnauthorizedException } from '@nestjs/common';
import { ObjectType } from '@nestjs/graphql';

import { UserEntity } from '../entities/user.entity';
import { UserPassword } from './user-password.model';

@ObjectType()
export class User extends UserEntity {
  constructor(attributes?: Partial<UserEntity>) {
    super();
    if (!attributes) {
      return;
    }
    this.id = attributes.id;
    this.email = attributes.email;
    this.name = attributes.name;
    this.code = attributes.code;
    this.weight = attributes.weight;
    this.height = attributes.height;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;
  }

  public updatePassword = (password: string, input: string): void => {
    if (!this.comparePassword(password)) {
      throw new UnauthorizedException();
    }

    this.updatedAt = new Date();
    this.password = new UserPassword(input);
  };

  public comparePassword = (password: string): boolean => {
    return this.password.compare(password);
  };
}
