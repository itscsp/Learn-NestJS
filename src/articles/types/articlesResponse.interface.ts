import { Article } from '@/src/articles/types/article.type';

export interface ArticlesResponse {
  articles: Article[];
  articleCount: number;
}
