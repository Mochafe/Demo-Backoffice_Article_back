import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { constants } from './constants';
import { User } from 'src/users/user.schema';
import { ArticleStatusEnum } from './enum/articleStatus.enum';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
export class Article extends Document {
  id: string;

  @Prop({
    type: String,
    required: true,
    minlength: constants.title.min,
    maxlength: constants.title.max,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
    minlength: constants.content.min,
    maxlength: constants.content.max,
  })
  content: string;

  createdAt: Date;

  updatedAt: Date;

  @Prop({
    type: String,
    required: true,
    enum: [ArticleStatusEnum.draft, ArticleStatusEnum.published],
  })
  status: ArticleStatusEnum;

  @Prop({
    type: Array<string>,
    required: true,
    minlength: constants.tags.min,
    maxlength: constants.tags.max,
  })
  tags: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  author: User;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.loadClass(Article);
