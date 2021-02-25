import { ApiProperty } from '@nestjs/swagger';
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

export class CreateUserDto implements Partial<IUser> {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  weight?: number;

  @ApiProperty()
  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  height?: number;
}
