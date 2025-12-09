import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserRepository, IUserRepositoryToken, User } from '../../domain';
import { JwtTokenService } from '../../infrastructure';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtTokenService,
    @Inject(IUserRepositoryToken) private readonly userRepo: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.jwtService.extractTokenFromHeader(request);
    let payload: Record<string, any>;
    let user: User;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      payload = await this.jwtService.validateToken(token);
    } catch {
      throw new UnauthorizedException();
    }
    try {
      user = await this.userRepo.findById(payload.userId);
    } catch {
      throw new UnauthorizedException();
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = user;

    return true;
  }
}
