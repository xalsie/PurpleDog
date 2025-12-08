import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  async create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async login() {
    return `This action returns all auth`;
  }

  async forget(id: number) {
    return `This action returns a #${id} auth`;
  }
}
