import { BadRequestException } from '@nestjs/common';

export class PointNotEnoughException extends BadRequestException {
  constructor(used: number, available: number) {
    super(`포인트 잔액이 부족합니다. (요청됨: ${used}, 보유중: ${available})`);
  }
}
