import { Controller, Post, HttpCode, Patch, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SpiderSellerResultDto } from './dtos';
import { SpiderService } from './provider.service';

@ApiTags('spider')
@Controller('/spider')
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}

  @Post('/sellers')
  @HttpCode(200)
  async requestSellers(): Promise<string> {
    const count = await this.spiderService.requestSellers();
    return `${count} seller requested!`;
  }

  @Patch('/sellers')
  @HttpCode(200)
  async processSellerResult(
    @Body() sellerResult: SpiderSellerResultDto
  ): Promise<void> {
    await this.spiderService.processSellerResult(sellerResult);
  }

  @Post('/items')
  @HttpCode(200)
  async requestItems(): Promise<void> {
    return null;
  }
}
