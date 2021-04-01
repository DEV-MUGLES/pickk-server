import { ICourierIssue } from './courier-issue.interface';

export interface ICourier {
  code: string;
  name: string;
  phoneNumber: string;
  returnReserveUrl: string;
  issue?: ICourierIssue;
}
