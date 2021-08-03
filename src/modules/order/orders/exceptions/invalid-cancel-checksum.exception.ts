import { BadRequestException } from '@nestjs/common';

export class InvalidCancelChecksumException extends BadRequestException {
  constructor(afterAmount: number, checksum: number) {
    super(
      `제공된 checksum이 취소 후 남은 총 결제금액과 일치하지 않습니다.\nchecksum: ${checksum}, 잔여 결제금액: ${afterAmount}`
    );
  }
}
