import { IImage } from '@src/common/interfaces/image.interface';

import { IBrand } from '../../brands/interfaces/brand.interface';
import { IItemUrl } from './item-url.interface';

export interface IItem {
  name: string;
  originalPrice: number;
  salePrice: number;
  isAvailable: boolean;
  thumbnailImage: IImage;
  brand: IBrand;
  urls: IItemUrl[];
}
