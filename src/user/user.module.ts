import { UserController } from '@/src/user/user.controller';
import { UserEntity } from '@/src/user/user.entity';
import { UserService } from '@/src/user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UsetModule {}
