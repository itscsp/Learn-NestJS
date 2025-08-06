import { CreateUserDto } from '@/src/user/dto/createUser.dto';
import { UserEntity } from '@/src/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepositry: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    return await this.userRepositry.save(newUser);
  }
}
