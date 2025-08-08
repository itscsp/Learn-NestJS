import { ArticleEntity } from '@/src/articles/article.entity';
import { CreateArticleDto } from '@/src/articles/dto/createArticle.dto';
import { UserEntity } from '@/src/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleServices {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>
  ) {}

  async createArticle(user: UserEntity, createArticleDto: CreateArticleDto) {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = 'slug-text';
    article.author = user;

    return await this.articleRepository.save(article)
  }
}
