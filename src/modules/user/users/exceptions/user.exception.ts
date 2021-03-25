import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

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

export class UserPasswordNotFoundException extends NotFoundException {
  constructor() {
    super('아직 비밀번호가 설정되지 않은 계정입니다.');
  }
}

export class UserAvatarImageNotFoundException extends NotFoundException {
  constructor() {
    super('프로핊 이미지가 존재하지 않습니다.');
  }
}
