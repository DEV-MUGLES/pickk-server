import { JobExecutionContextRecord } from '@src/modules/common/jobs/models';

export class JobExecutionContext {
  private record: Record<string, any> = {};

  public put(key: string, data: any) {
    this.record[key] = data;
  }

  public get(key: string) {
    return this.record[key];
  }

  public convertToJobExecutionContextRecord() {
    return new JobExecutionContextRecord({
      shortContext: JSON.stringify(this.record),
    });
  }
}
