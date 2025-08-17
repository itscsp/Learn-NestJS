import { ArticleServices } from '@/src/articles/article.service';
import { CreateArticleDto } from '@/src/articles/dto/createArticle.dto';
import { UpdateArticleDto } from '@/src/articles/dto/updateArticle.dto';
import { IArticleResponse } from '@/src/articles/types/articleResponse.interface';
import { ArticlesResponse } from '@/src/articles/types/articlesResponse.interface';
import { User } from '@/src/user/decorators/user.decorators';
import { AuthGuard } from '@/src/user/guards/auth.guard';
import { UserEntity } from '@/src/user/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleServices) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createArticle(
    @User() user: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const newArticle = await this.articleService.createArticle(
      user,
      createArticleDto,
    );

    return await this.articleService.generateArticleResponse(newArticle);
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string): Promise<IArticleResponse> {
    const article = await this.articleService.getSingleArticle(slug);

    return this.articleService.generateArticleResponse(article);
  }

  @Delete(':slug')
  async deleteArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
  ) {
    return await this.articleService.deleteArticle(slug, currentUserId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  async updateArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<IArticleResponse> {
    const updateArticle = await this.articleService.updateArticle(
      slug,
      currentUserId,
      updateArticleDto,
    );

    return this.articleService.generateArticleResponse(updateArticle);
  }

  @Get()
  async findAll(@Query() query: any): Promise<ArticlesResponse> {
    return await this.articleService.findAll(query);
  }

  @Post(':slug/favorites')
  @UseGuards(AuthGuard)
  async addToFavoriteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return await this.articleService.addToFavoriteArticle(currentUserId, slug);
  }

  @Delete(':slug/favorites')
  @UseGuards(AuthGuard)
  async removeFromFavoriteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return await this.articleService.removeFromFavoriteArticle(
      currentUserId,
      slug,
    );
  }
}
