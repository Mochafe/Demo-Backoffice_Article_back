import { User } from '../../users/user.schema';
import { ArticleStatusEnum } from '../enum/articleStatus.enum';

export type ArticleData = {
  title: string;
  content: string;
  status: ArticleStatusEnum;
  tags: string[];
  author?: User;
};
