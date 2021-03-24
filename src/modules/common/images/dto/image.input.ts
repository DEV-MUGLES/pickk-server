import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server-express';
import { FileUpload } from 'graphql-upload';

import { Exclude } from 'class-transformer';

@InputType()
export class UploadImageInput {
  @Field(() => [GraphQLUpload])
  @Exclude()
  files: Promise<FileUpload>[];
}
