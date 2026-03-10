import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './models/like.model';
import { Comment } from './models/comment.model';
import { Follower } from './models/follower.model';
import { Post } from '../posts/models/post.model';
import { User } from '../users/models/user.model';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class SocialService {
  constructor(
    @InjectModel(Like) private likeModel: typeof Like,
    @InjectModel(Comment) private commentModel: typeof Comment,
    @InjectModel(Follower) private followerModel: typeof Follower,
    @InjectModel(Post) private postModel: typeof Post,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  // --- Likes ---
  async toggleLike(postId: string, userId: string) {
    const post = await this.postModel.findByPk(postId);
    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await this.likeModel.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      await existingLike.destroy();
      await post.decrement('likesCount');
      return { liked: false };
    } else {
      await this.likeModel.create({ postId, userId });
      await post.increment('likesCount');
      return { liked: true };
    }
  }

  async getLikes(postId: string) {
    return this.likeModel.findAll({
      where: { postId },
      include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
    });
  }

  // --- Comments ---
  async addComment(postId: string, userId: string, dto: CreateCommentDto) {
    const post = await this.postModel.findByPk(postId);
    if (!post) throw new NotFoundException('Post not found');

    const comment = await this.commentModel.create({
      postId,
      userId,
      content: dto.content,
    });

    await post.increment('commentsCount');
    return comment;
  }

  async removeComment(commentId: string, userId: string) {
    const comment = await this.commentModel.findByPk(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await comment.destroy();

    // Decrement post comment count
    const post = await this.postModel.findByPk(comment.postId);
    if (post) {
      await post.decrement('commentsCount');
    }

    return { success: true };
  }

  async getComments(postId: string) {
    return this.commentModel.findAll({
      where: { postId },
      include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']],
    });
  }

  // --- Followers ---
  async toggleFollow(followingId: string, followerId: string) {
    if (followingId === followerId) {
      throw new ConflictException('You cannot follow yourself');
    }

    const userToFollow = await this.userModel.findByPk(followingId);
    if (!userToFollow) throw new NotFoundException('User to follow not found');

    const existingFollow = await this.followerModel.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      await existingFollow.destroy();
      return { followed: false };
    } else {
      await this.followerModel.create({ followerId, followingId });
      return { followed: true };
    }
  }

  async getFollowers(userId: string) {
    const followers = await this.followerModel.findAndCountAll({
      where: { followingId: userId },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });
    return followers;
  }

  async getFollowing(userId: string) {
    const following = await this.followerModel.findAndCountAll({
      where: { followerId: userId },
      include: [
        {
          model: User,
          as: 'following',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });
    return following;
  }
}
