import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { JWT_SERVICE, JWTServiceInterface } from '../../contexts/auth/interface/jwt.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JWT_SERVICE) private readonly jwtService: JWTServiceInterface,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verifyToken(token) as any;
      request.user = payload.userCredentials;
      return true;
    } catch (error) {
      return false;
    }
  }
}
