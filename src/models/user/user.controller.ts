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
import { CreateUserDto, EditUserDto } from './dto';
import {
  UserEntity,
  extendedUserGroupsForSerializing,
} from './serializers/user.serializer';
import { UserService } from './user.service';

@Controller('users')
@SerializeOptions({
  groups: extendedUserGroupsForSerializing,
})
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async list(): Promise<UserEntity[]> {
    return await this.usersService.list();
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@Param('id') id: number): Promise<UserEntity> {
    const user = this.usersService.get(id.toString());
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
    @Body() inputs: EditUserDto
  ): Promise<UserEntity> {
    return await this.usersService.update(id.toString(), inputs);
  }
}
