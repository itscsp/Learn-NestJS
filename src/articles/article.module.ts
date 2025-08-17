import { ArticleController } from '@/src/articles/article.controller';
import { ArticleEntity } from '@/src/articles/article.entity';
import { UserEntity } from '@/src/user/user.entity';
import { ArticleServices } from '@/src/articles/article.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity])],
  controllers: [ArticleController],
  providers: [ArticleServices],
})
export class ArticleModule {
  constructor() {}
}
