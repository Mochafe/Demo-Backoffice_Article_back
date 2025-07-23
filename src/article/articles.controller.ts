import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ArticleDataDto } from './dto/article.data.dto';
import { ArticlesService } from './articles.service';
import { UsersService } from 'src/users/users.service';
import { ArticleSearchDto } from './dto/article.search.dto';
import { User } from 'src/users/user.schema';
import { ArticleOwnGuard } from './guards/article.own.guard';
import { Article } from './article.schema';

@Controller('articles')
export class ArticlesController {
  constructor(
    private articlesService: ArticlesService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Req() req: any, @Body() articleDataDto: ArticleDataDto) {
    const user: User = req.user;

    return await this.articlesService.create({
      ...articleDataDto,
      author: user,
    });
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, ArticleOwnGuard)
  async update(@Req() req: any, @Body() articleDataDto: ArticleDataDto) {
    const article: Article = req.article;

    return await this.articlesService.update(article, articleDataDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, ArticleOwnGuard)
  delete(@Req() req: any) {
    const article: Article = req.article;

    this.articlesService.delete(article);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(
    @Query()
    articleSearchDto: ArticleSearchDto,
  ) {
    return await this.articlesService.findByFilters(
      {
        title: articleSearchDto.title,
        tags: articleSearchDto.tags,
        authorId: articleSearchDto.authorId,
      },
      {
        page: articleSearchDto.page,
        limit: 10,
      },
    );
  }
}
