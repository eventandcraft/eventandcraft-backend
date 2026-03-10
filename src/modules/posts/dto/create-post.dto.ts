import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreatePostMediaDto {
  @ApiProperty({ example: 'https://example.com/image.png' })
  @IsString()
  url: string;

  @ApiProperty({ enum: ['image', 'video'] })
  @IsEnum(['image', 'video'])
  mediaType: string;

  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class CreatePostDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  connectedServiceId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ enum: ['draft', 'published'], default: 'draft' })
  @IsEnum(['draft', 'published'])
  @IsOptional()
  status?: string;

  @ApiProperty({ type: [CreatePostMediaDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMediaDto)
  @IsOptional()
  media?: CreatePostMediaDto[];
}
