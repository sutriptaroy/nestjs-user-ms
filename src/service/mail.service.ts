import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMail } from 'src/dto/common.dto';

@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService) {}

    async sendMail(input: SendMail) {
        this.mailerService.sendMail(input)
    }
}
