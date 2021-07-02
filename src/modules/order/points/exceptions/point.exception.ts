import { ForbiddenException } from '@nestjs/common';

export class ForbiddenPointSubtractEventExeption extends ForbiddenException {
  constructor() {
    super('사용가능한 포인트보다 사용한 포인트가 더 많습니다.');
  }
}
