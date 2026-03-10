import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';

@Table({
  tableName: 'categories',
})
export class Category extends BaseModel<Category> {
  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'parent_id',
  })
  parentId: string;

  @BelongsTo(() => Category, 'parent_id')
  parent: Category;

  @HasMany(() => Category, 'parent_id')
  children: Category[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  icon: string;
}
