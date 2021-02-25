import {
  Get,
  Put,
  Post,
  Body,
  Controller,
  UseInterceptors,
  SerializeOptions,
  ClassSerializerInterceptor,
  Param,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import {
  UserEntity,
  extendedUserGroupsForSerializing,
} from './serializers/user.serializer';
import { UsersService } from './users.service';

@Controller('users')
@SerializeOptions({
  groups: extendedUserGroupsForSerializing,
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async list(): Promise<UserEntity[]> {
    return await this.usersService.list();
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@Param('id') id: number): Promise<UserEntity> {
    const user = this.usersService.get(id);
    return user;
  }

  @Post('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() inputs: CreateUserDto): Promise<UserEntity> {
    return await this.usersService.create(inputs);
  }

  @Put('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id') id: number,
    @Body() inputs: UpdateUserDto
  ): Promise<UserEntity> {
    return await this.usersService.update(id, inputs);
  }
}
