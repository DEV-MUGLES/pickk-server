import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class UserEmailNotFoundExeption extends NotFoundException {
  constructor() {
    super('해당 이메일 주소의 회원을 찾을 수 없습니다.');
  }
}

export class UserCodeNotFoundExeption extends NotFoundException {
  constructor() {
    super('해당 아이디의 회원을 찾을 수 없습니다.');
  }
}

export class UserOauthNotFoundExeption extends NotFoundException {
  constructor() {
    super('해당 인증 정보의 회원을 찾을 수 없습니다.');
  }
}

export class ForbiddenResourceException extends ForbiddenException {
  constructor(role?: string) {
    super(
      role
        ? `${role} 이상의 권한이 필요합니다.`
        : '해당 리소스에대한 접근이 금지되었습니다.'
    );
  }
}
