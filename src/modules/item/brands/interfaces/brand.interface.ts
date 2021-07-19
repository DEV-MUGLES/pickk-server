import { ISeller } from '@item/sellers/interfaces';

export interface IBrand {
  nameKor: string;
  nameEng?: string;
  description?: string;
  imageUrl?: string;

  seller?: ISeller;
}
