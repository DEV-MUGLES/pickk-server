import bcrypt from 'bcryptjs';

import { ObjectType } from '@nestjs/graphql';
import { UserPasswordEntity } from '../entities/user-password.entity';
import { UserPasswordInvalidException } from '../exceptions/user.exception';

@ObjectType()
export class UserPassword extends UserPasswordEntity {
  public static minLength = 8;
  private static validRegex = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_=(),./:;{}[\]|\\<>-]).{8,}$/;

  public static of(password: string): UserPassword {
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

  /**
   * 입력된 비밀번호가 규칙에 맞는지 검증합니다. (영문+숫자+특수문자, 총 8글자 이상)
   * @param password 검증할 비밀번호 문자열
   * @returns 통과 여부 boolean
   */
  public static validate(password: string): boolean {
    if (typeof password !== 'string') {
      return false;
    }

    return this.validRegex.test(password);
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
