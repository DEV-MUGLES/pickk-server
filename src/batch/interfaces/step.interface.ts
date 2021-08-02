import { IRead } from './read.interface';
import { IWrite } from './write.interface';

export interface IStep<T = unknown> {
  read: IRead<T>;
  write?: IWrite<T>;
}
