import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './models/post.model';
import { PostMedia } from './models/post-media.model';

@Module({
  imports: [SequelizeModule.forFeature([Post, PostMedia])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, SequelizeModule],
})
export class PostsModule {}
