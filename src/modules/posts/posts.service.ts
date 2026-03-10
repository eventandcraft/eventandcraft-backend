import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './models/post.model';
import { PostMedia } from './models/post-media.model';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postModel: typeof Post,
    @InjectModel(PostMedia) private postMediaModel: typeof PostMedia,
  ) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    const { media, ...postData } = createPostDto;

    const post = await this.postModel.create({
      ...postData,
      creatorId: userId,
    });

    if (media && media.length > 0) {
      const mediaData = media.map((m) => ({
        ...m,
        postId: post.id,
      }));
      await this.postMediaModel.bulkCreate(mediaData);
    }

    return this.findOne(post.id);
  }

  async findAll(filter: Record<string, string> = {}) {
    return this.postModel.findAll({
      where: filter,
      include: [PostMedia],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: string) {
    const post = await this.postModel.findByPk(id, { include: [PostMedia] });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async updateStatus(
    id: string,
    userId: string,
    updatePostStatusDto: UpdatePostStatusDto,
  ) {
    const post = await this.findOne(id);

    if (post.creatorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    await post.update({ status: updatePostStatusDto.status });
    return post;
  }

  async remove(id: string, userId: string) {
    const post = await this.findOne(id);

    if (post.creatorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postMediaModel.destroy({ where: { postId: id } });
    await post.destroy();

    return { success: true, message: 'Post deleted successfully' };
  }
}
