import { BadRequestException, NotFoundException } from '@nestjs/common';

export class CourierIssueInvalidEndAtException extends BadRequestException {
  constructor() {
    super('종료 시점은 현재보다 이후여야만 합니다.');
  }
}

export class CourierIssueNotFoundException extends NotFoundException {
  constructor() {
    super('삭제할 배송사 이슈가 없습니다.');
  }
}
