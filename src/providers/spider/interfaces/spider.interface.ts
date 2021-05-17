export interface ISpiderItem {
  name: string;
  brandKor: string;
  imageUrl: string;
  originalPrice: number;
  salePrice: number;
  isSoldout?: boolean;
  images?: string[];
  url: string;
}
