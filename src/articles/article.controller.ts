import { ArticleEntity } from '@/src/articles/article.entity';
import { ArticleServices } from '@/src/articles/article.service';
import { CreateArticleDto } from '@/src/articles/dto/createArticle.dto';
import { User } from '@/src/user/decorators/user.decorators';
import { AuthGuard } from '@/src/user/guards/auth.guard';
import { UserEntity } from '@/src/user/user.entity';
import {
  Body,
  Controller,
  Post,
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
  ): Promise<ArticleEntity> {
    return await this.articleService.createArticle(user, createArticleDto);
  }
}
