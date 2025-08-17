import { ArticleController } from '@/src/articles/article.controller';
import { ArticleEntity } from '@/src/articles/article.entity';
import { UserEntity } from '@/src/user/user.entity';
import { ArticleServices } from '@/src/articles/article.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from '@/src/profile/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity])],
  controllers: [ArticleController],
  providers: [ArticleServices],
})
export class ArticleModule {
  constructor() {}
}
