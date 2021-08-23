import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

import { IKeyword } from '../interfaces';

@InputType()
export class KeywordFilter implements Partial<IKeyword> {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isVisible: boolean;
}
