import { AllowNull,BelongsTo,Column,DataType,Default,ForeignKey,Model,PrimaryKey,Table} from 'sequelize-typescript';

import { Order } from './order.entity';

@Table({
    timestamps:false
})
export class OrderItem extends Model {

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID })
  declare orderId: string;

  @BelongsTo(() => Order, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
    as: 'order',
  })
  declare order: Order;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare description: string;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER, validate: { min: 1 } })
  declare quantity: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER, validate: { min: 1 } })
  declare unitPrice: number;

}