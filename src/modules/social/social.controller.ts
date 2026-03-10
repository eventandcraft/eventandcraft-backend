import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { SocialService } from './social.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';

@ApiTags('Social')
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Toggle like on a post' })
  @Post('posts/:postId/like')
  toggleLike(@Param('postId') postId: string, @User() user: { sub: string }) {
    return this.socialService.toggleLike(postId, user.sub);
  }

  @ApiOperation({ summary: 'Get likes for a post' })
  @Get('posts/:postId/likes')
  getLikes(@Param('postId') postId: string) {
    return this.socialService.getLikes(postId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Add a comment to a post' })
  @Post('posts/:postId/comments')
  addComment(
    @Param('postId') postId: string,
    @User() user: { sub: string },
    @Body() dto: CreateCommentDto,
  ) {
    return this.socialService.addComment(postId, user.sub, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Remove a comment from a post' })
  @Delete('comments/:commentId')
  removeComment(
    @Param('commentId') commentId: string,
    @User() user: { sub: string },
  ) {
    return this.socialService.removeComment(commentId, user.sub);
  }

  @ApiOperation({ summary: 'Get comments for a post' })
  @Get('posts/:postId/comments')
  getComments(@Param('postId') postId: string) {
    return this.socialService.getComments(postId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Toggle follow/unfollow a user' })
  @Post('users/:userId/follow')
  toggleFollow(
    @Param('userId') followingId: string,
    @User() user: { sub: string },
  ) {
    return this.socialService.toggleFollow(followingId, user.sub);
  }

  @ApiOperation({ summary: 'Get followers of a user' })
  @Get('users/:userId/followers')
  getFollowers(@Param('userId') userId: string) {
    return this.socialService.getFollowers(userId);
  }

  @ApiOperation({ summary: 'Get users a user is following' })
  @Get('users/:userId/following')
  getFollowing(@Param('userId') userId: string) {
    return this.socialService.getFollowing(userId);
  }
}
