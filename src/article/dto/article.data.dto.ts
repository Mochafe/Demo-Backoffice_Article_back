import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { constants } from '../constants';
import { ArticleStatusEnum } from '../enum/articleStatus.enum';

export class ArticleDataDto {
  @IsString()
  @MinLength(constants.title.min)
  @MaxLength(constants.title.max)
  title: string;

  @IsString()
  @MinLength(constants.content.min)
  @MaxLength(constants.content.max)
  content: string;

  @IsEnum(ArticleStatusEnum)
  status: ArticleStatusEnum;

  @IsArray()
  @ArrayMinSize(constants.tags.min)
  @ArrayMaxSize(constants.tags.max)
  @IsString({ each: true })
  tags: string[];
}
