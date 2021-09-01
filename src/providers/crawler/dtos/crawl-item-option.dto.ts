export class CrawlItemOptionResponseDto {
  values: { [name: string]: Array<string> };
  isSoldout: Array<Array<number>>;
  productPriceVariants: Array<{ option: Array<number>; price: number }>;
  optionPriceVariants: Array<{ option: Array<number>; price: number }>;
  url: string;
}
