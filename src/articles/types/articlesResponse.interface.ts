import { ArticleEntity } from '@/src/articles/article.entity';

export interface ArticlesResponse {
  articles: ArticleEntity[];
  articleCount: number;
}
