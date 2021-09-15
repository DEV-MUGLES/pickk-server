export type S3UploadResultDto = {
  url: string;
  key: string;
};

export type S3DeleteResultDto = AWS.S3.DeletedObjects;
