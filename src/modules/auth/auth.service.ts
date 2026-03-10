import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../firebase/firebase.service';

interface TokenPayload {
  sub?: string;
  email?: string;
  phoneNumber?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private firebaseService: FirebaseService,
  ) {}

  async googleSignup(token: string) {
    try {
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(token);
      const { uid, email, name } = decodedToken;

      if (!email) {
        throw new BadRequestException('Google token does not contain an email');
      }

      let user = await this.usersService.findByFirebaseUid(uid);

      if (!user) {
        user = await this.usersService.findByEmail(email);
        if (user) {
          user = await this.usersService.update(user.id, { firebaseUid: uid });
        } else {
          // Extract firstName and lastName from name
          const nameString: string = name || '';
          const nameParts: string[] = nameString ? nameString.split(' ') : [];
          const firstName: string =
            nameParts.length > 0 ? String(nameParts[0]) : '';
          const lastName: string =
            nameParts.length > 1 ? String(nameParts.slice(1).join(' ')) : '';

          user = await this.usersService.create({
            firebaseUid: uid,
            email,
            firstName,
            lastName,
          });
        }
      }

      if (!user) {
        throw new UnauthorizedException('Failed to resolve user');
      }

      return this.generateTokens({
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    } catch (error: unknown) {
      this.logger.error('Google signup error', error);
      if (error instanceof BadRequestException) throw error;
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async phoneSignup(phoneNumber: string) {
    // For phone auth, Firebase typically handles the SMS sending on the client side.
    if (!phoneNumber) {
      throw new BadRequestException('Phone number is required');
    }
    return {
      message: 'Initiate phone verification on the client side with Firebase.',
    };
  }

  async verifyPhoneSignup(token: string) {
    try {
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(token);
      const { uid, phone_number } = decodedToken;

      if (!phone_number) {
        throw new BadRequestException(
          'Firebase token does not contain a phone number',
        );
      }

      let user = await this.usersService.findByFirebaseUid(uid);

      if (!user) {
        user = await this.usersService.findByPhoneNumber(phone_number);
        if (user) {
          user = await this.usersService.update(user.id, { firebaseUid: uid });
        } else {
          user = await this.usersService.create({
            firebaseUid: uid,
            phoneNumber: phone_number,
          });
        }
      }

      if (!user) {
        throw new UnauthorizedException('Failed to resolve user');
      }

      return this.generateTokens({
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    } catch (error: unknown) {
      this.logger.error('Phone signup verify error', error);
      if (error instanceof BadRequestException) throw error;
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_SECRET_KEY',
          ),
        },
      );

      if (!payload.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findOne(payload.sub);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens({
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    } catch (error: unknown) {
      this.logger.error('Refresh token error', error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(user: {
    id: string;
    email?: string;
    phoneNumber?: string;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    // Use string type for signOptions compatible with @nestjs/jwt
    const accessSecret =
      this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY') || 'secret';
    // Let's coerce expiresIn to string if it's there
    const accessExp =
      this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRY') || '15m';
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET_KEY') ||
      'secret';
    const refreshExp =
      this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRY') || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExp as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExp as any,
      }),
    ]);

    await this.usersService.update(user.id, { refreshToken });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
