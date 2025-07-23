import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
  ): Promise<User> {
    return await this.userModel.create({
      email,
      password,
      firstname,
      lastname,
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email: email }).exec();
  }
}
