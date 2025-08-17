import type { ArticleEntity } from '@/src/articles/article.entity';

// API returns the entity fields plus a computed 'favorited' flag.
export type Article = Omit<ArticleEntity, 'updateTimestap'> & {
	favorited: boolean;
};
