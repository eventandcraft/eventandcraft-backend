import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './models/review.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review) private reviewModel: typeof Review) {}

  async create(buyerId: string, createReviewDto: CreateReviewDto) {
    if (buyerId === createReviewDto.creatorId) {
      throw new BadRequestException('You cannot review yourself');
    }

    return this.reviewModel.create({
      ...createReviewDto,
      buyerId,
    });
  }

  async findAllByCreator(creatorId: string) {
    return this.reviewModel.findAll({
      where: { creatorId },
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: string) {
    const review = await this.reviewModel.findByPk(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: string, buyerId: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);

    if (review.buyerId !== buyerId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    await review.update(updateReviewDto);
    return review;
  }

  async remove(id: string, buyerId: string) {
    const review = await this.findOne(id);

    if (review.buyerId !== buyerId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await review.destroy();
    return { success: true, message: 'Review deleted successfully' };
  }
}
