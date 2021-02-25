import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto implements Partial<User> {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  weight?: number;

  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  height?: number;
}
