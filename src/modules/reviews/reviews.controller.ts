import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new review' })
  @Post()
  create(
    @User() user: { sub: string },
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.sub, createReviewDto);
  }

  @ApiOperation({ summary: 'List all reviews for a specific creator' })
  @Get('creator/:creatorId')
  findAllByCreator(@Param('creatorId') creatorId: string) {
    return this.reviewsService.findAllByCreator(creatorId);
  }

  @ApiOperation({ summary: 'Get a specific review' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update your review' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @User() user: { sub: string },
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, user.sub, updateReviewDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete your review' })
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: { sub: string }) {
    return this.reviewsService.remove(id, user.sub);
  }
}
