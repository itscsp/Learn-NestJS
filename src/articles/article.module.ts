import { ArticleController } from '@/src/articles/article.controller';
import { ArticleEntity } from '@/src/articles/article.entity';
import { ArticleServices } from '@/src/articles/article.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArticleController],
  providers: [ArticleServices],
})
export class ArticleModule {
  constructor() {}
}
