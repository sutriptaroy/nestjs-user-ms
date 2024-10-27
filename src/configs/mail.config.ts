import { ConfigService } from '@nestjs/config';

export const mailConfig = (configService: ConfigService) => ({
  transport: {
    host: configService.get<string>('SMTP_URL'),
    auth: {
      user: configService.get<string>('MAIL_USER'),
      pass: configService.get<string>('MAIL_PASS'),
    },
  },
});
