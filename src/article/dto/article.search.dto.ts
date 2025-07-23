import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class ArticleSearchDto {
  @IsOptional()
  title: string | undefined;

  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  @Transform((params: TransformFnParams) => (params.value as string).split(','))
  tags?: string[] | undefined;

  @IsOptional()
  authorId: string | undefined;

  @IsOptional()
  page: number;
}
