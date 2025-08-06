import { CreateUserDto } from '@/src/user/dto/createUser.dto';
import { LoginUserDto } from '@/src/user/dto/loginUser.dto';
import { IUserInterface } from '@/src/user/types/userResponse.interface';
import { UserEntity } from '@/src/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
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
      throw new HttpException(
        'Email or username is already token',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const savedUser = await this.userRepositry.save(newUser);
    return this.generateUserResponse(savedUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<IUserInterface> {
    const user = await this.userRepositry.findOne({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Email or Password is wrong.',
        HttpStatus.UNAUTHORIZED,
      );
    }


    const matchPassword = await compare(loginUserDto.password, user.password);
    if (!matchPassword) {
      throw new HttpException(
        'Email or Password is wrong.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;

    return this.generateUserResponse(user);
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
