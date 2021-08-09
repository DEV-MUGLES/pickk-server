import { PickType } from '@nestjs/mapped-types';

import { Seller } from '../models';

export class ScrapSellerItemUrlsDto extends PickType(Seller, [
  'brand',
  'crawlStrategy',
]) {}
