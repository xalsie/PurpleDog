import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SecurityModule } from 'src/security/security.module';
import { AuthModule } from '../auth';

@Module({
  imports: [AuthModule, SecurityModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
