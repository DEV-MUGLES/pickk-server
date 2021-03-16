import { ConflictException } from '@nestjs/common';

export class UserPasswordDuplicatedException extends ConflictException {
  constructor() {
    super('기존과 동일한 비밀번호가 입력되었습니다.');
  }
}
