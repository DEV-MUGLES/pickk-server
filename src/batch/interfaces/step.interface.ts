import { IProcess } from './process.interface';
import { IRead } from './read.interface';
import { ITasklet } from './tasklet.interface';
import { IWrite } from './write.interface';

export interface IStep<ReadResult = unknown, ProcessResult = unknown> {
  tasklet?: ITasklet;
  read?: IRead<ReadResult>;
  write?: IWrite<ReadResult | ProcessResult>;
  process?: IProcess<ReadResult, ProcessResult>;
}
