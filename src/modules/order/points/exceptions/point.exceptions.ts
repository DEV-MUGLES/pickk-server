import { BadRequestException } from '@nestjs/common';

export class AddPointTypeAmountInvalidException extends BadRequestException {
  constructor() {
    super('Add포인트타입은 amount가 음수일 수 없습니다.');
  }
}

export class SubPointTypeAmountInvalidException extends BadRequestException {
  constructor() {
    super('Sub포인트타입은 amount가 양수일 수 없습니다.');
  }
}

export class NotEnoughPointAmountException extends BadRequestException {
  constructor() {
    super(
      '보유한 포인트보다 사용한 포인트가 더 많습니다. 포인트가 부족합니다.'
    );
  }
}
