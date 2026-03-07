import { IsEmail, IsNotEmpty, IsString, IsObject, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum EMAIL_TEMPLATES {
  WELCOME = 'welcome',
  BOOKING_APPROVAL = 'booking-approval',
  CHECKIN_CONFIRMED = 'checkin-confirmed',
  BOOKING_SUCCESSFULL = 'booking-successfull',
  CHECKOUT_CONFIRMED = 'checkout-confirm',
  GENERIC = 'generic',
}

export class CreateMailerDto {
  @ApiProperty({ description: 'Subject of the email' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Content of the email' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Recipient email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class MailParams {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsEnum(EMAIL_TEMPLATES)
  @IsNotEmpty()
  template: EMAIL_TEMPLATES;

  @IsObject()
  @IsNotEmpty()
  context: Record<string, string>;

  @IsEmail()
  @IsNotEmpty()
  to: string;
}
