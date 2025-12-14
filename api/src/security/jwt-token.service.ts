import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from './entities';
import { env } from '../env.type';
import { User } from '../user';

@Injectable()
export class JwtTokenService implements ITokenService {
    private readonly secret: string =
        env.JWT_SECRET || 'so_izzzi_default_secret';

    constructor(private readonly jwtService: JwtService) {}

    async generateToken(user: User): Promise<string> {
        const payload = { userId: user.id, email: user.email };
        const result = await this.jwtService.signAsync(payload, {
            secret: this.secret,
            expiresIn: '1h',
        });
        return result;
    }

    async validateToken(token: string): Promise<Record<string, any> | null> {
        return this.jwtService.verifyAsync(token, {
            secret: this.secret,
        });
    }

    extractTokenFromHeader(request: Request): string | undefined {
        const rawAuth =
            typeof (request.headers as any)?.get === 'function'
                ? (request.headers as any).get('authorization')
                : (request as any).headers?.authorization;
        const [type, token] = (rawAuth ?? '').split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}
