import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/v1/users/users.module';
import { ResetToken, ResetTokenSchema } from 'src/schemas/resetToken.schema';
import { MailService } from 'src/service/mail.service';
import { mailConfig } from 'src/configs/mail.config';

@Module({
  providers: [AuthService, MailService],
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async(config) => ({
        secret: config.get('jwt.secret')
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([
      {
        name: ResetToken.name,
        schema: ResetTokenSchema
      }
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mailConfig,
    }),
  ]
})
export class AuthModule {}
