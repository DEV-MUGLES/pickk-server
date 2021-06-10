import { ISeller } from '../../sellers/interfaces/seller.interface';

export interface IBrand {
  nameKor: string;
  nameEng?: string;
  description?: string;
  imageUrl?: string;

  seller?: ISeller;
}
