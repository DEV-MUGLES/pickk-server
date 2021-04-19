export interface IItemCategory {
  name: string;
  code: string;

  children: IItemCategory[];
  parent: IItemCategory;
}
