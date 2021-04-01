import { IImage } from '@src/common/interfaces/image.interface';

import { IBrand } from '../../brands/interfaces/brand.interface';
import { IItemProfileUrl } from './item-profile-url.interface';

export interface IItemProfile {
  name: string;
  originalPrice: number;
  salePrice: number;
  isAvailable: boolean;
  thumbnailImage: IImage;
  brand: IBrand;
  urls: IItemProfileUrl[];
}
