import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Sequelize, Op } from 'sequelize';

import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
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
          items: createOrderDto.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
        {
          include: [{ model: OrderItem, as: 'items' }],
          transaction,
        },
      );

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

  async findAll(): Promise<{ orders: Order[]; total: number }> {
    const cached = await this.cacheManager.get<{ orders: Order[], total: number }>(OrdersService.CACHE_KEY_ACTIVE_ORDERS);
    if (cached) {
      this.logger.log('Órdenes obtenidas desde caché');
      return cached;
    }

    const [orders, total] = await Promise.all([
      this.orderModel.findAll({
        where: { status: { [Op.ne]: OrderStatus.DELIVERED } },
        include: [OrderItem],
        order: [['createdAt', 'DESC']],
      }),
      this.orderModel.count({
        where: { status: { [Op.ne]: OrderStatus.DELIVERED } },
      }),
    ]);

    await this.cacheManager.set(OrdersService.CACHE_KEY_ACTIVE_ORDERS, { orders, total }, 30_000);
    this.logger.log('Órdenes guardadas en caché');

    return { total, orders  };
  }



  async advanceStatus(id: string): Promise<string> {

    const order = await this.findOne(id)

    const nextStatus = OrdersService.advanceStatusOrder(order.status);

    if (nextStatus === OrderStatus.DELIVERED) {
      await this.orderModel.destroy({ where: { id } });
      await this.cacheManager.del(OrdersService.CACHE_KEY_ACTIVE_ORDERS);

      this.logger.log(`Orden ${id} entregada y eliminada.`);
      return `Orden ${id} entregada (eliminada del sistema).`;
    }


    order.status = nextStatus;
    await order.save();

    await this.cacheManager.del(OrdersService.CACHE_KEY_ACTIVE_ORDERS);

    this.logger.log(`Orden ${id} actualizada a estado ${nextStatus}`);
    return `Orden ${id} actualizada a estado ${nextStatus}`;
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
