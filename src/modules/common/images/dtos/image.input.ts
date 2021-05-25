import { IsMimeType, IsOptional, IsString } from 'class-validator';

export class UploadBufferDto {
  buffer: Buffer;

  @IsString()
  filename: string;

  @IsMimeType()
  mimetype: string;

  @IsString()
  @IsOptional()
  prefix?: string;
}
