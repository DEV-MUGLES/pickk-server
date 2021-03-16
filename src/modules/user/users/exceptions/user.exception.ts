import { BadRequestException, ConflictException } from '@nestjs/common';

export class UserPasswordDuplicatedException extends ConflictException {
  constructor() {
    super('기존과 동일한 비밀번호가 입력되었습니다.');
  }
}

export class UserPasswordInvalidException extends BadRequestException {
  constructor() {
    super(
      '(영문/숫자/특수문자 포함, 8글자 이상)에 맞지 않는 비밀번호가 입력되었습니다.'
    );
  }
}
