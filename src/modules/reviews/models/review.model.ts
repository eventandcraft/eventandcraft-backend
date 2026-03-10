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
  tableName: 'reviews',
})
export class Review extends BaseModel<Review> {
  @Column({
    type: DataType.UUID,
    allowNull: true, // Allow null since invoice module is not implemented yet
    field: 'invoice_id',
  })
  invoiceId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'buyer_id',
  })
  buyerId: string;

  @BelongsTo(() => User, 'buyer_id')
  buyer: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'creator_id',
  })
  creatorId: string;

  @BelongsTo(() => User, 'creator_id')
  creator: User;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  })
  rating: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;
}
