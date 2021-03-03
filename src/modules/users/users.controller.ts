import {
  Get,
  Put,
  Post,
  Body,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async list(): Promise<User[]> {
    return await this.usersService.list();
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@Param('id') id: number): Promise<User> {
    const user = this.usersService.get(id);
    return user;
  }

  @Post('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() inputs: CreateUserDto): Promise<User> {
    return await this.usersService.create(inputs);
  }

  @Put('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id') id: number,
    @Body() inputs: UpdateUserDto
  ): Promise<User> {
    return await this.usersService.update(id, inputs);
  }
}
