import type { AuthRequest } from '@/src/types/expressRequest.interface';
import { User } from '@/src/user/decorators/user.decorators';
import { CreateUserDto } from '@/src/user/dto/createUser.dto';
import { LoginUserDto } from '@/src/user/dto/loginUser.dto';
import { UpdateUserDto } from '@/src/user/dto/updateUser.dto';
import { AuthGuard } from '@/src/user/guards/auth.guard';
import { IUserInterface } from '@/src/user/types/userResponse.interface';
import { UserService } from '@/src/user/user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post('user')
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

  @Put('user')
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') userId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<IUserInterface> {
    const updartedUser = await this.userService.updateUser(
      userId,
      updateUserDto,
    );
    return this.userService.generateUserResponse(updartedUser);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async getCurrentUser(@User() user): Promise<IUserInterface> {
    return this.userService.generateUserResponse(user);
  }
}
