export interface IStepExecutionRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date;
  endAt: Date;
  status: string;
  errorMessage: string;
  stepName: string;

  jobExecutionRecordId?: number;
}
