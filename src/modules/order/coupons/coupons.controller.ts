import { Controller, Delete, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CouponsService } from './coupons.service';

@ApiTags('coupons')
@Controller('/coupons')
export class CouponController {
  constructor(private readonly couponsService: CouponsService) {}

  @Delete('/remove-expired')
  @HttpCode(200)
  async removeExpired(): Promise<void> {
    await this.couponsService.removeExpired();
  }
}
