export class CrawlItemOptionResponseDto {
  values: { [name: string]: string[] };
  isSoldout: number[][];
  productPriceVariants: { option: number[]; price: number }[];
  optionPriceVariants: { option: number[]; price: number }[];
  url: string;
}
