import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostStatusDto {
  @ApiProperty({ enum: ['draft', 'published'] })
  @IsEnum(['draft', 'published'])
  @IsNotEmpty()
  status: string;
}
