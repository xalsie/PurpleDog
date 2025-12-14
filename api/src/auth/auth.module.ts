import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SecurityModule } from '../security';
import { User, ProfessionalProfile, Profile } from '../user';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile, ProfessionalProfile]),
        SecurityModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
