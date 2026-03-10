import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true, // Enables soft deletion (deletedAt)
})
export class BaseModel<T extends {} = {}, T2 extends {} = {}> extends Model<
  T,
  T2
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  // Timestamps managed by Sequelize
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date;
}
