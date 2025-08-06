import type { AuthRequest } from '@/src/types/expressRequest.interface';
import { User } from '@/src/user/decorators/user.decorators';
import { CreateUserDto } from '@/src/user/dto/createUser.dto';
import { LoginUserDto } from '@/src/user/dto/loginUser.dto';
import { IUserInterface } from '@/src/user/types/userResponse.interface';
import { UserService } from '@/src/user/user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserInterface> {
    return await this.userService.createUser(createUserDto);
  }

  @Post('user/login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<IUserInterface> {
    return await this.userService.loginUser(loginUserDto);
  }

  @Get('user')

  async getCurrentUser(@User() user): Promise<IUserInterface> {
    return this.userService.generateUserResponse(user)
  }
}
