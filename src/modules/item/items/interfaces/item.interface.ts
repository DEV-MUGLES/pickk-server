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
  description?: string;

  /** Item 정보는 크롤링 과정에서 Bulk로 다룰 일이 많아 이미지를 필드로 처리합니다. */
  imageUrl: string;

  isMdRecommended: boolean;
  isSellable: boolean;
  isInfiniteStock: boolean;
  isSoldout: boolean;

  brand: IBrand;

  prices: IItemPrice[];
  urls: IItemUrl[];
  detailImages: IImage[];
  options: IItemOption[];
  products: IProduct[];

  majorCategory?: IItemCategory;
  majorCategoryId?: number;
  minorCategory?: IItemCategory;
  minorCategoryId?: number;
}
