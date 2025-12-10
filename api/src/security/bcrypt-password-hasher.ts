import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from './entities';
import { env } from '../env.type';

@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    const saltRounds = env.BCRYPT_SALT_ROUNDS
      ? parseInt(env.BCRYPT_SALT_ROUNDS)
      : 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
