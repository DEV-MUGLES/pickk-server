import { KeywordClassType } from '../constants';

export interface IKeywordClass {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  type: KeywordClassType;
  name: string;
  order: number;
  isVisible: boolean;
}
