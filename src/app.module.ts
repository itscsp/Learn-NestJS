import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { UsetModule } from '@/src/user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), TagModule, UsetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
