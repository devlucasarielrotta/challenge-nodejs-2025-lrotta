// src/seed/seed.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { ordersSeed } from './data/data';
import { Sequelize } from 'sequelize-typescript';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly sequelize: Sequelize,
  ) {}

  async runSeed() {
    this.logger.log('Eliminando todas las órdenes existentes');

    try {
      
      await this.sequelize.transaction(async (transaction) => {
        await OrderItem.destroy({ where: {}, truncate: true, cascade: true, transaction });
        await Order.destroy({ where: {}, truncate: true, cascade: true, transaction });
      });
      this.logger.log('Órdenes e items existentes eliminados.');
    } catch (error) {
      this.logger.error('Error eliminando órdenes existentes', error);
    }

    this.logger.log('Iniciando seed de órdenes');
    for (const orderDto of ordersSeed) {
      try {

        const order = await this.ordersService.create(orderDto);
        this.logger.log(`Orden creada: ${order.id}`);

      } catch (error) {
        this.logger.error('Error creando la orden', error);
      }
    }

    this.logger.log('Seed finalizado.');
    return { message: 'Seed de órdenes completado!' };
  }
}
