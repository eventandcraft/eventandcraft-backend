import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from '../../../common/models/base.model';

@Table({
  tableName: 'users',
})
export class User extends BaseModel<User> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  firebaseUid: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  refreshToken: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;
}
