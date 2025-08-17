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
import { FollowEntity } from '@/src/profile/follow.entity';

@Injectable()
export class ArticleServices {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepositry: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepositry: Repository<FollowEntity>,
  ) {}

  async findAll(
    query: {
      tag?: string;
      author?: string;
      favorited?: string;
      limit?: number | string;
      offset?: number | string;
    },
    currentUserId?: number,
  ): Promise<ArticlesResponse> {
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

    if (query.favorited) {
      const favoriter = await this.userRepositry.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });

      if (
        !favoriter ||
        !favoriter.favorites ||
        favoriter.favorites.length === 0
      ) {
        return { articles: [], articleCount: 0 };
      }

      const favoritesIds = favoriter.favorites.map((a) => a.id);
      queryBuilder.andWhere('articles.id IN (:...ids)', { ids: favoritesIds });
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articleCount = await queryBuilder.getCount();

    const limit =
      query.limit !== undefined && query.limit !== null
        ? Number(query.limit)
        : undefined;
    const offset =
      query.offset !== undefined && query.offset !== null
        ? Number(query.offset)
        : undefined;

    if (typeof limit === 'number' && !Number.isNaN(limit)) {
      queryBuilder.limit(limit);
    }

    if (typeof offset === 'number' && !Number.isNaN(offset)) {
      queryBuilder.offset(offset);
    }

    const articles = await queryBuilder.getMany();

    let userFavoritesIds: number[] = [];

    if (currentUserId) {
      const currentUser = await this.userRepositry.findOne({
        where: {
          id: currentUserId,
        },
        relations: ['favorites'],
      });

      if (currentUser) {
        userFavoritesIds = currentUser?.favorites.map((article) => article.id);
      }
    }

    const articleWithFavorited = articles.map((article) => {
      const favorited = userFavoritesIds.includes(article.id);
      return { ...article, favorited };
    });

    return {
      articles: articleWithFavorited,
      articleCount,
    };
  }

  async getFeed(currentUserId: number, query: any): Promise<ArticlesResponse> {
    const follows = await this.followRepositry.find({
      where: {
        followerId: currentUserId,
      },
    });

    const followingIds = follows.map((user) => user.followingId);

    if (!follows.length) {
      return { articles: [], articleCount: 0 };
    }

    const queryBuilder = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.andWhere('articles.authorId IN (:...followingIds)', {
      followingIds,
    });

    const articleCount = await queryBuilder.getCount();


    if (query?.offset) {
      queryBuilder.limit(query.offset);
    }

    if (query?.limit) {
      queryBuilder.limit(query.limit);
    }

    const articlesRaw = await queryBuilder.getMany();

    // No favorited context here; default to false
    const articles = articlesRaw.map((a) => ({ ...a, favorited: false }));

    return { articles, articleCount };
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

    const isFavorite = (user.favorites || []).some(
      (fav) => fav.id === article.id,
    );
    if (isFavorite) {
      user.favorites = (user.favorites || []).filter(
        (fav) => fav.id !== article.id,
      );
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
