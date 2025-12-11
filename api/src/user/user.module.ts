import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SecurityModule } from '../security';
import { AuthModule } from '../auth/auth.module';
import { User } from './entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User]), AuthModule, SecurityModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
