import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './article.schema';
import { Model } from 'mongoose';
import { ArticleStatusEnum } from './enum/articleStatus.enum';
import { ArticleData } from './types/article.data';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async create({
    title,
    content,
    status = ArticleStatusEnum.draft,
    tags,
    author,
  }: ArticleData) {
    if (author === undefined)
      throw new InternalServerErrorException('author should be defined');

    return await this.articleModel.create({
      title,
      content,
      status,
      tags,
      author: author,
    });
  }

  async update(
    article: Article,
    { title, content, status, tags }: ArticleData,
  ): Promise<Article> {
    article.title = title;
    article.content = content;
    article.status = status;
    article.tags = tags;

    return await article.save();
  }

  delete(article: Article) {
    article.deleteOne();
  }

  async findByFilters(
    filters: {
      title: string | undefined;
      tags: string[] | undefined;
      authorId: string | undefined;
    } | null,
    pagination: { page: number | undefined; limit: number } | null,
  ): Promise<{
    articles: Article[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query: any = {
      status: ArticleStatusEnum.published,
    };
    if (filters) {
      if (filters.title) {
        query.title = { $regex: filters.title, $options: 'i' };
      }
      if (filters.tags && filters.tags.length > 0) {
        query.tags = {
          $in: filters.tags.map((tag) => new RegExp(`^${tag}$`, 'i')),
        };
      }
      // TODO: Search by full name (virtual, start by fetching user);
    }

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const fetchArticlesPromise = this.articleModel
      .find(query)
      .populate('author')
      .limit(limit)
      .skip(skip)
      .exec();

    const totalArticlesPromise = this.articleModel.countDocuments({
      status: ArticleStatusEnum.published,
    });

    const [articles, total] = await Promise.all([
      fetchArticlesPromise,
      totalArticlesPromise,
    ]);

    return { articles, total, page, limit };
  }

  async findById(id: string): Promise<Article | null> {
    return this.articleModel.findById(id);
  }
}
