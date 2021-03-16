import { ConflictException, UnauthorizedException } from '@nestjs/common';

export class UserPasswordDuplicatedException extends ConflictException {
  constructor() {
    super('기존과 동일한 비밀번호가 입력되었습니다.');
  }
}

export class UserPasswordInvalidException extends UnauthorizedException {
  constructor() {
    super('잘못된 비밀번호가 입력되었습니다.');
  }
}
