import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';
import { User } from '../../users/models/user.model';
import { PostMedia } from './post-media.model';

@Table({
  tableName: 'posts',
})
export class Post extends BaseModel<Post> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'creator_id',
  })
  creatorId: string;

  @BelongsTo(() => User)
  creator: User;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'connected_service_id',
  })
  connectedServiceId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content: string;

  @Column({
    type: DataType.ENUM('draft', 'published'),
    allowNull: false,
    defaultValue: 'draft',
  })
  status: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'likes_count',
  })
  likesCount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'comments_count',
  })
  commentsCount: number;

  @HasMany(() => PostMedia)
  media: PostMedia[];
}
