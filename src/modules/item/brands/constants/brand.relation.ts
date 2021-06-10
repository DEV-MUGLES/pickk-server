import { Brand } from '../models/brand.model';

import {
  SellerRelationType,
  SELLER_RELATIONS,
} from '../../sellers/constants/seller.relation';

export type BrandRelationType = keyof Brand | `seller.${SellerRelationType}`;

export const BRAND_RELATIONS: Array<BrandRelationType> = [
  'seller',
  ...SELLER_RELATIONS.map(
    (relationName) => `seller.${relationName}` as BrandRelationType
  ),
];
