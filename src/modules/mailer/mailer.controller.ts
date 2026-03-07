import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { CreateMailerDto } from './dto/create-mailer.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('mailer')
@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('ping')
  @ApiOperation({ summary: 'Send a ping email' })
  @ApiResponse({ status: 201, description: 'Email sent successfully' })
  createMailer(@Body() createMailerDto: CreateMailerDto) {
    return this.mailerService.sendPing(createMailerDto);
  }
}
