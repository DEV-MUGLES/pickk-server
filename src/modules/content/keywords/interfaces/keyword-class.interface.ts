import { IBaseId } from '@common/interfaces';

import { KeywordClassType } from '../constants';

export interface IKeywordClass extends IBaseId {
  type: KeywordClassType;
  name: string;
  order: number;
  isVisible: boolean;
}
