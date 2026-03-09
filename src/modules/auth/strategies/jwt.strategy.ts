import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub?: string;
  email?: string;
  phoneNumber?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: String(
        configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
      ),
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException();
    }
    const userId: string = payload.sub;
    const email: string | undefined = payload.email;
    const phoneNumber: string | undefined = payload.phoneNumber;

    return { userId, email, phoneNumber };
  }
}
