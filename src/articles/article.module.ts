import { ArticleController } from '@/src/articles/article.controller';
import { ArticleServices } from '@/src/articles/article.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ArticleController],
  providers: [ArticleServices],
})
export class ArticleModule {
  constructor() {}
}
