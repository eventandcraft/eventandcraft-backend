import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';
import { Post } from './post.model';

@Table({
  tableName: 'post_media',
})
export class PostMedia extends BaseModel<PostMedia> {
  @ForeignKey(() => Post)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'post_id',
  })
  postId: string;

  @BelongsTo(() => Post)
  post: Post;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.ENUM('image', 'video'),
    allowNull: false,
    field: 'media_type',
  })
  mediaType: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order',
  })
  sortOrder: number;
}
