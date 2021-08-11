import { PickType } from '@nestjs/mapped-types';

import { Seller } from '@item/sellers/models';

export class ScrapSellerItemsMto extends PickType(Seller, [
  'brand',
  'crawlStrategy',
]) {}
