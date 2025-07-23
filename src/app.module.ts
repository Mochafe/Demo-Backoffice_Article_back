import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './article/articles.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/demo-backoffice'),
    UsersModule,
    AuthModule,
    ArticlesModule,
  ],
})
export class AppModule {}
