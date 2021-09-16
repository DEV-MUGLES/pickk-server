import { IBaseId } from '@common/interfaces';

import { IUser } from '@user/users/interfaces';

import { InquiryAnswerFrom } from '../constants';

import { IInquiry } from './inquiry.interface';

export interface IInquiryAnswer extends IBaseId {
  inquiry: IInquiry;
  inquiryId: number;

  user: IUser;
  userId: number;

  from: InquiryAnswerFrom;
  displayAuthor: string;
  content: string;
}
