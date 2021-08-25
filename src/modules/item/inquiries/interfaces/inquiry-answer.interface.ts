import { IUser } from '@user/users/interfaces';

import { InquiryAnswerFrom } from '../constants';

export interface IInquiryAnswer {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  user: IUser;
  userId: number;

  from: InquiryAnswerFrom;
  displayAuthor: string;
  content: string;
}
