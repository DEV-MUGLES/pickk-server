import { BadRequestException } from '@nestjs/common';

export class UuidNotMatchedException extends BadRequestException {
  constructor() {
    super('잘못된 uuid입니다.');
  }
}
