import { IImage } from '@src/common/interfaces/image.interface';

import { IBrand } from '../../brands/interfaces/brand.interface';
import { IItemCategory } from '../../item-categories/interfaces/item-category.interface';
import { IProduct } from '../../products/interfaces/product.interface';

import { IItemOption } from './item-option.interface';
import { IItemPrice } from './item-price.interface';
import { IItemUrl } from './item-url.interface';

export interface IItem {
  name: string;
  /** (제휴아이템만) 공식홈페이지에서 사용된 식별자입니다. */
  providedCode?: string;

  isManaging: boolean;
  isMdRecommended: boolean;
  isSellable: boolean;

  thumbnailImage: IImage;
  brand: IBrand;

  prices: IItemPrice[];
  urls: IItemUrl[];
  detailImages: IImage[];
  options: IItemOption[];
  products: IProduct[];

  majorCategory: IItemCategory;
  minorCategory: IItemCategory;
}
