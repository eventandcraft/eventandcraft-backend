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
  tableName: 'comments',
})
export class Comment extends BaseModel<Comment> {
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

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;
}
