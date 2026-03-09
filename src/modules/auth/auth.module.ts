import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule, FirebaseModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
