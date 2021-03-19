import { CourierIssue } from '../models/courier-issue.model';

export interface ICourier {
  code: string;
  name: string;
  phoneNumber: string;
  returnReserveUrl: string;
  issue?: CourierIssue;
}
