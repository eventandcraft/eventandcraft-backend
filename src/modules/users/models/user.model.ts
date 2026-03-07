import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';

@Table({
  tableName: 'users',
})
export class User extends BaseModel<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;
}
