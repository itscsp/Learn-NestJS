import { CreateUserDto } from '@/src/user/dto/createUser.dto';
import { IUserInterface } from '@/src/user/types/userResponse.interface';
import { UserEntity } from '@/src/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepositry: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<IUserInterface> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    const userByEmail = await this.userRepositry.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    const userByUsername = await this.userRepositry.findOne({
      where: {
        username: createUserDto.username,
      },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException('Email or username is already token', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const savedUser = await this.userRepositry.save(newUser);
    return this.generateUserResponse(savedUser);
  }

  generateToken(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }

  generateUserResponse(user: UserEntity): IUserInterface {
    return {
      user: {
        ...user,
        token: this.generateToken(user),
      },
    };
  }
}
