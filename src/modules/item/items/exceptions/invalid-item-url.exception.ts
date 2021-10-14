import { InternalServerErrorException } from '@nestjs/common';

export class InvalidItemUrlException extends InternalServerErrorException {
  constructor() {
    super(`Item의 Url이 유효하지 않습니다.`);
  }
}
