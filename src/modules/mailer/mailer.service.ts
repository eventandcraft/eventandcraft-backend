import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMailerDto, MailParams } from './dto/create-mailer.dto';
import { MailerService as NodeMailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailerService {
  constructor(private readonly nodeMailerService: NodeMailerService) { }
  sendPing(dto: CreateMailerDto) {
    try {
      this.nodeMailerService.sendMail({
        to: dto.email,
        from: process.env.MAIL_USER,
        subject: dto.subject,
        template: 'welcome',
        context: {
          firstName: 'user',
          username: 'user 1',
        },
      });
      return { message: 'Email sent successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  send(dto: MailParams) {
    console.log({ dto });
    this.nodeMailerService
      .sendMail({
        to: dto.to,
        from: process.env.MAIL_USER,
        subject: dto.subject,
        template: dto.template,
        context: dto.context,
      })
      .catch((e) => {
        console.log(e);
      });
    return { message: 'Email sent successfully' };
  }
}
