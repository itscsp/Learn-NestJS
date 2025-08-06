import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { UsetModule } from '@/src/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), ConfigModule.forRoot({
    isGlobal: true,
  }), TagModule, UsetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
