export interface IStepExecutionRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  startAt: Date;
  endAt: Date;
  status: string;
  exitMessage: string;
  stepName: string;

  jobExecutionRecordId?: number;
}
