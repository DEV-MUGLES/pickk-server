import { JobExecutionContextRecord } from '@src/modules/common/jobs/models';

export class JobExecutionContext {
  private data: Record<string, any> = {};

  public put(key: string, data: any) {
    this.data[key] = data;
  }

  public get(key: string) {
    return this.data[key];
  }

  public getAll() {
    return this.data;
  }

  public convertToRecord() {
    return new JobExecutionContextRecord({
      shortContext: JSON.stringify(this.data),
    });
  }
}
