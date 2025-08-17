import { ArticleEntity } from '@/src/articles/article.entity';
import { CreateArticleDto } from '@/src/articles/dto/createArticle.dto';
import { IArticleResponse } from '@/src/articles/types/articleResponse.interface';
import { UpdateArticleDto } from '@/src/articles/dto/updateArticle.dto';
import { UserEntity } from '@/src/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import slugify from 'slugify';
import { ArticlesResponse } from '@/src/articles/types/articlesResponse.interface';

@Injectable()
export class ArticleServices {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepositry: Repository<UserEntity>,
  ) {}

  async findAll(query: {
    tag?: string;
    author?: string;
    limit?: number;
    offset?: number;
  }): Promise<ArticlesResponse> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepositry.findOne({
        where: {
          username: query.author,
        },
      });

      if (!author) {
        return { articles: [], articleCount: 0 };
      }

      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articleCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return {
      articles,
      articleCount,
    };
  }

  async createArticle(user: UserEntity, createArticleDto: CreateArticleDto) {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    // Javascript lessaon => javascript->lesson -> blog.com/javascript-lesson
    article.slug = this.generateSlug(article.title);
    article.author = user;

    return await this.articleRepository.save(article);
  }

  async getSingleArticle(slug: string): Promise<ArticleEntity> {
    return await this.findBySlug(slug);
  }

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (article.author.id !== currentUserId) {
      throw new HttpException('Your Not Authorized', HttpStatus.UNAUTHORIZED);
    }

    return await this.articleRepository.delete({ slug });
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: {
        slug,
      },
    });

    if (!article) {
      throw new HttpException('Article is not found', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async updateArticle(
    slug: string,
    currentUserId: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (article.author.id !== currentUserId) {
      throw new HttpException('Your Not Authorized', HttpStatus.UNAUTHORIZED);
    }

    if (updateArticleDto.title) {
      article.slug = this.generateSlug(updateArticleDto.title);
    }

    Object.assign(article, updateArticleDto);

    return await this.articleRepository.save(article);
  }

  async addToFavoriteArticle(currentUserId: number, slug: string) {
    const user = await this.userRepositry.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const article = await this.findBySlug(slug);

    const alreadyFavorited = (user.favorites || []).some(
      (fav) => fav.id === article.id,
    );

    if (!alreadyFavorited) {
      user.favorites = [...(user.favorites || []), article];
      await this.userRepositry.save(user);

      article.favoriteCount = (article.favoriteCount || 0) + 1;
      await this.articleRepository.save(article);
    }

    return this.generateArticleResponse(article);
  }

  async removeFromFavoriteArticle(currentUserId: number, slug: string) {
    const user = await this.userRepositry.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const article = await this.findBySlug(slug);

    const isFavorite = (user.favorites || []).some((fav) => fav.id === article.id);
    if (isFavorite) {
      user.favorites = (user.favorites || []).filter((fav) => fav.id !== article.id);
      await this.userRepositry.save(user);

      article.favoriteCount = Math.max(0, (article.favoriteCount || 0) - 1);
      await this.articleRepository.save(article);
    }

    return this.generateArticleResponse(article);
  }

  generateSlug(title: string): string {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    return `${slugify(title, { lower: true })}-${id}`;
  }
  generateArticleResponse(article: ArticleEntity): IArticleResponse {
    return {
      article,
    };
  }
}
