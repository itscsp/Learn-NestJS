import { CreateUserDto } from '@/src/user/dto/createUser.dto';
import { LoginUserDto } from '@/src/user/dto/loginUser.dto';
import { IUserInterface } from '@/src/user/types/userResponse.interface';
import { UserService } from '@/src/user/user.service';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserInterface> {
    return await this.userService.createUser(createUserDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<IUserInterface> {
    return await this.userService.loginUser(loginUserDto);
  }
}
