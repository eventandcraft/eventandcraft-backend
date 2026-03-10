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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new post' })
  @Post()
  create(@User() user: { sub: string }, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(user.sub, createPostDto);
  }

  @ApiOperation({ summary: 'List posts with optional filters' })
  @ApiQuery({ name: 'status', required: false, enum: ['draft', 'published'] })
  @ApiQuery({ name: 'creatorId', required: false })
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('creatorId') creatorId?: string,
  ) {
    const filter: Record<string, string> = {};
    if (status) filter.status = status;
    if (creatorId) filter.creatorId = creatorId;
    return this.postsService.findAll(filter);
  }

  @ApiOperation({ summary: 'Get a specific post' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Change post status (draft/published)' })
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @User() user: { sub: string },
    @Body() updatePostStatusDto: UpdatePostStatusDto,
  ) {
    return this.postsService.updateStatus(id, user.sub, updatePostStatusDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a post' })
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: { sub: string }) {
    return this.postsService.remove(id, user.sub);
  }
}
