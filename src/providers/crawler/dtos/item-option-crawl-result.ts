export class ItemOptionCrawlResult {
  options: OptionData[];
}

export class OptionData {
  name: string;
  values: OptionValueData[];
}

export class OptionValueData {
  name: string;
  priceVariant: number;
}
