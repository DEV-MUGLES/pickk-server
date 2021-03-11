import { UnauthorizedException } from '@nestjs/common';

export class PasswordIncorrectException extends UnauthorizedException {
  constructor() {
    super('비밀전호가 일치하지 않습니다.');
  }
}
