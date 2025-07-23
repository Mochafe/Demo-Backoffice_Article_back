import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ArticlesService } from '../articles.service';
import { User } from 'src/users/user.schema';

@Injectable()
export class ArticleOwnGuard implements CanActivate {
  constructor(
    @Inject(ArticlesService) private articlesService: ArticlesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request.query.id;

    if (id === undefined)
      throw new BadRequestException('Request should have id in query');

    const article = await this.articlesService.findById(id);
    if (article === null) throw new NotFoundException("Article doesn't exist");
    await article.populate('author');

    const user: User = request.user;
    if (!user)
      throw new InternalServerErrorException('Shoud be use after AuthGuard');

    if (article.author.equals(user)) {
      request.article = article;
      return true;
    } else {
      return false;
    }
  }
}
