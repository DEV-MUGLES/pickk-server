import { IImage } from '@src/common/interfaces/image.interface';

import { IBrand } from '../../brands/interfaces/brand.interface';
import { IProduct } from '../../products/interfaces/product.interface';
import { IItemOption } from './item-option.interface';
import { IItemUrl } from './item-url.interface';

export interface IItem {
  name: string;
  originalPrice: number;
  salePrice: number;
  providedCode?: string;

  isManaging: boolean;
  isMdRecommended: boolean;
  isSellable: boolean;

  thumbnailImage: IImage;
  brand: IBrand;

  urls: IItemUrl[];
  detailImages: IImage[];
  options: IItemOption[];
  products: IProduct[];
}
