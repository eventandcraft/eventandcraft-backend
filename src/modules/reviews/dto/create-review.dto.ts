import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    required: false,
    description: 'Optional invoice ID if applicable',
  })
  @IsString()
  @IsOptional()
  invoiceId?: string;

  @ApiProperty({ description: 'The ID of the creator being reviewed' })
  @IsString()
  @IsNotEmpty()
  creatorId: string;

  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
