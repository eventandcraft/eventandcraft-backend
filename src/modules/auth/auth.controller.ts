import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google-signup')
  @HttpCode(HttpStatus.OK)
  async googleSignup(@Body('token') token: string) {
    return this.authService.googleSignup(token);
  }

  @Post('phone-signup')
  @HttpCode(HttpStatus.OK)
  async phoneSignup(@Body('phoneNumber') phoneNumber: string) {
    return this.authService.phoneSignup(phoneNumber);
  }

  @Post('phone-signup/verify')
  @HttpCode(HttpStatus.OK)
  async verifyPhoneSignup(@Body('token') token: string) {
    return this.authService.verifyPhoneSignup(token);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
