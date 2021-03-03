import { InputType, Field, PartialType } from '@nestjs/graphql';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { IUser } from '../interfaces/user.interface';

@InputType()
export class CreateUserDto implements Partial<IUser> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  weight?: number;

  @Field({ nullable: true })
  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  height?: number;
}

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {}
