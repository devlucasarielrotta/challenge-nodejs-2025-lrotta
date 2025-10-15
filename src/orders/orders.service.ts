import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Sequelize , Op} from 'sequelize';

import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem } from './entities/order-item.entity';

import { OrderStatus } from './entities/enums/orderStatus.enum';
import type { Cache } from 'cache-manager';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name, { timestamp: true });
  private static readonly CACHE_KEY_ACTIVE_ORDERS = 'orders:active';
  private static readonly transitionsStates: Record<OrderStatus, OrderStatus | null> = {
    [OrderStatus.INITIATED]: OrderStatus.SENT,
    [OrderStatus.SENT]: OrderStatus.DELIVERED,
    [OrderStatus.DELIVERED]: null,
  };

  constructor(

    @InjectModel(Order)
    private readonly orderModel: typeof Order,

    @InjectModel(OrderItem)
    private readonly orderItemModeL: typeof OrderItem,

    @InjectConnection()
    private readonly sequelize: Sequelize,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const transaction = await this.sequelize.transaction();

    try {

      const order = await this.orderModel.create(
        {
          clientName: createOrderDto.clientName,
          status: OrderStatus.INITIATED,
        },
        { transaction },
      );

      const items = createOrderDto.items.map(item => ({
        ...item,
        orderId: order.id
      }));

      await this.orderItemModeL.bulkCreate(items, { transaction })
      await transaction.commit();
      this.logger.log(`Orden creada exitosamente con ID ${order.id}`);

      return order;
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error al crear la orden', error);
      throw new InternalServerErrorException('Ocurrio un error en el servidor' + error)
    }
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findByPk(id, {
        include: [OrderItem],
    });

    if (!order) {
        this.logger.warn(`Orden con ID ${id} no encontrada.`);
        throw new NotFoundException(`Orden con ID ${id} no encontrada.`);
    }
    
    this.logger.log(`Orden ${id} encontrada exitosamente.`);
    return order;
  }

  async findAll(): Promise<Order[]> {
    const cacheKey = 'orders:active';
    const cached = await this.cacheManager.get<Order[]>(cacheKey);

    if (cached) {
      this.logger.log('Órdenes obtenidas desde caché');
      return cached;
    }

    const orders = await this.orderModel.findAll({
      where: { status: { [Op.ne]: OrderStatus.DELIVERED } },
      include: [OrderItem],
      order: [['createdAt', 'DESC']],
    });

    await this.cacheManager.set(cacheKey, orders, 30_000);
    this.logger.log('Órdenes guardadas en caché');

    return orders;
  }


  remove(id: string) {
    return `This action removes a #${id} order`;
  }

  private static advanceStatusOrder(current: OrderStatus): OrderStatus {
    const nextState = this.transitionsStates[current];

    if (!nextState) {
      throw new Error(
        `La orden en estado "${current}" no puede avanzar más o no tiene una transición definida.`
      );
    }

    return nextState;
  }
}
