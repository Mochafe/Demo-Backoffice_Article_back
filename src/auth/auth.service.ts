import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
  ): Promise<User> {
    const registredUser = await this.usersService.create(
      email,
      password,
      firstname,
      lastname,
    );

    // Send confirmation mail

    return registredUser;
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user?.comparePassword(password)) throw new UnauthorizedException();

    const payload = { sub: user.id, email: email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
