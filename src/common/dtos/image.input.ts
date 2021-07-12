import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { Exclude } from 'class-transformer';

@InputType()
export class UploadMultipleImageInput {
  @Field(() => [GraphQLUpload])
  @Exclude()
  files: Promise<FileUpload>[];
}

@InputType()
export class UploadSingleImageInput {
  @Field(() => GraphQLUpload)
  @Exclude()
  file: Promise<FileUpload>;
}
