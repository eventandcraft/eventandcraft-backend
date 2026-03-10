import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';
import { User } from '../../users/models/user.model';
import { Post } from '../../posts/models/post.model';

@Table({
  tableName: 'likes',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'post_id'], // A user can only like a post once
    },
  ],
})
export class Like extends BaseModel<Like> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'post_id',
  })
  postId: string;

  @BelongsTo(() => Post)
  post: Post;
}
