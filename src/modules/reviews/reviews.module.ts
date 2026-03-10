import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from './models/review.model';
import { User } from '../users/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Review, User])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService, SequelizeModule],
})
export class ReviewsModule {}
