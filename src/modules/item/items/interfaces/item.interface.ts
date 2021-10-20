import { IBaseId, IImage } from '@common/interfaces';

import { IDigest } from '@content/digests/interfaces';
import { IItemsGroupItem } from '@exhibition/items-groups/interfaces';
import { IBrand } from '@item/brands/interfaces';
import { ICampaign } from '@item/campaigns/interfaces';
import { IItemCategory } from '@item/item-categories/interfaces';
import { IProduct } from '@item/products/interfaces';

import { IItemSizeChart } from './item-size-chart.interface';
import { IItemOption } from './item-option.interface';
import { IItemPrice } from './item-price.interface';
import { IItemUrl } from './item-url.interface';
import { IItemSalePolicy } from './item-sale-policy.interface';

export interface IItem extends IBaseId {
  brand: IBrand;
  brandId: number;

  options: IItemOption[];
  products: IProduct[];
  campaigns: ICampaign[];

  digests: IDigest[];

  majorCategory?: IItemCategory;
  majorCategoryId?: number;
  minorCategory?: IItemCategory;
  minorCategoryId?: number;

  salePolicy: IItemSalePolicy;
  prices: IItemPrice[];
  urls: IItemUrl[];
  detailImages: IImage[];
  sizeCharts?: IItemSizeChart[];

  itemsGroupItem: IItemsGroupItem;

  name: string;
  /** (제휴아이템만) 공식홈페이지에서 사용된 식별자입니다. */
  providedCode?: string;
  description?: string;
  /** Item 정보는 크롤링 과정에서 Bulk로 다룰 일이 많아 이미지를 필드로 처리합니다. */
  imageUrl: string;

  isMdRecommended: boolean;
  /** 판매가능 여부 */
  isSellable: boolean;
  /** 구매가능 여부 */
  isPurchasable: boolean;
  /** 무한재고 여부 */
  isInfiniteStock: boolean;
  /** 품절 여부 (모든 Product의 stock이 0인 경우) */
  isSoldout: boolean;

  /** 판매가능시점(=활성전환일) */
  sellableAt?: Date;

  // 여기서부터 계산되는 fields
  digestAverageRating: number;
  digestCount: number;
  hitCount: number;
  score: number;
}
