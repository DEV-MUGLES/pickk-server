import { IBaseId } from '@common/interfaces';

import { ISeller } from '@item/sellers/interfaces';

export interface IBrand extends IBaseId {
  seller: ISeller;

  nameKor: string;
  nameEng?: string;
  description?: string;
  imageUrl?: string;
}
