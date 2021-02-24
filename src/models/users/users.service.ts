import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { UserEntity } from './serializers/user.serializer';
import { CreateUserDto, EditUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async list(relations: string[] = []): Promise<UserEntity[]> {
    const users = await this.usersRepository.find({ relations });
    return this.usersRepository.transformMany(users);
  }

  async get(id: string, relations: string[] = []): Promise<UserEntity> {
    return await this.usersRepository.get(id, relations);
  }

  async create(inputs: CreateUserDto): Promise<UserEntity> {
    return await this.usersRepository.createEntity(inputs);
  }

  async update(id: string, inputs: EditUserDto): Promise<UserEntity> {
    const user = await this.usersRepository.get(id);
    return await this.usersRepository.updateEntity(user, inputs);
  }
}
