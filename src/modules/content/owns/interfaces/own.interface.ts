import { IKeyword } from '@content/keywords/interfaces';
import { IUser } from '@user/users/interfaces';

export interface IOwn {
  id: number;
  createdAt: Date;

  user: IUser;
  userId: number;

  keyword: IKeyword;
  keywordId: number;
}
