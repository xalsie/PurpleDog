import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../env.type';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { BcryptPasswordHasher } from './bcrypt-password-hasher';
import { JwtTokenService } from './jwt-token.service';
import {
  IPasswordHasherToken,
  ITokenServiceToken,
} from './entities';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: env.JWT_SECRET || 'purple_dog_found_a_good_secret',
      signOptions: { expiresIn: parseInt(env.JWT_EXPIRES_IN) || '1h' },
    }),
  ],
  providers: [
    BcryptPasswordHasher,
    JwtTokenService,
    AuthGuard,
    RolesGuard,
    {
      provide: IPasswordHasherToken,
      useExisting: BcryptPasswordHasher,
    },
    {
      provide: ITokenServiceToken,
      useExisting: JwtTokenService,
    }
  ],
  exports: [
    BcryptPasswordHasher,
    JwtTokenService,
    AuthGuard,
    RolesGuard,
    IPasswordHasherToken,
    ITokenServiceToken,
  ],
})
export class SecurityModule {}
