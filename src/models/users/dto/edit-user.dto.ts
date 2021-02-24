import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class EditUserDto implements Partial<User> {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  height: number;
}
