import { CreateUserDto } from '@/src/user/dto/createUser.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  createUser(createUserDto: CreateUserDto): CreateUserDto {
    return createUserDto;
  }
}
