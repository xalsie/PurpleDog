import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user';
import { JwtTokenService } from './jwt-token.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtTokenService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.jwtService.extractTokenFromHeader(request);
        let payload: Record<string, any> | null;
        let user: User | null;
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            payload = await this.jwtService.validateToken(token);
        } catch {
            throw new UnauthorizedException();
        }
        if (!payload) {
            throw new UnauthorizedException();
        }
        try {
            user = await this.userRepo.findOne({
                where: { email: payload.email },
            });
            if (!user) {
                throw new UnauthorizedException();
            }
            request.user = user;
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }
}
