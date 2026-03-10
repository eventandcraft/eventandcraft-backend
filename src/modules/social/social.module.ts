import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { Like } from './models/like.model';
import { Comment } from './models/comment.model';
import { Follower } from './models/follower.model';
import { Post } from '../posts/models/post.model';
import { User } from '../users/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Like, Comment, Follower, Post, User])],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService, SequelizeModule],
})
export class SocialModule {}
