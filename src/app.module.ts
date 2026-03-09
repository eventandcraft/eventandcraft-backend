import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule as NodeMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database.config';
import { UsersModule } from './modules/users/users.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { StorageModule } from './modules/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    DatabaseModule,
    UsersModule,
    FirebaseModule,
    StorageModule,
    AuthModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: String(configService.get('JWT_ACCESS_TOKEN_SECRET_KEY')),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRY', '15m'),
        },
      }),
    }),

    NodeMailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          secure: true,
          port: 465,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: '"EventCraft"  <eandc@gmail.com>',
        },
        template: {
          dir: __dirname + '/../templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
