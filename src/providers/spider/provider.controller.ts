import { Controller, Post, HttpCode, Patch, Body } from '@nestjs/common';

import { SpiderSellerResultDto } from './dto/spider.dto';
import { SpiderService } from './provider.service';

@Controller('/spider')
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}

  @Patch('/sellers')
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
