import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';
import { User } from '../../users/models/user.model';

@Table({
  tableName: 'followers',
  indexes: [
    {
      unique: true,
      fields: ['follower_id', 'following_id'], // A user can only follow another user once
    },
  ],
})
export class Follower extends BaseModel<Follower> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'follower_id',
  })
  followerId: string;

  @BelongsTo(() => User, 'follower_id')
  follower: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'following_id',
  })
  followingId: string;

  @BelongsTo(() => User, 'following_id')
  following: User;
}
