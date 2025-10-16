import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import { Op } from 'sequelize';

import { OrdersService } from '../orders.service';

import { Order } from '../entities/order.entity';
import { OrderStatus } from '../entities/enums/orderStatus.enum';

@Injectable()
export class CleanupOrdersJob {
  private readonly logger = new Logger(CleanupOrdersJob.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly configService: ConfigService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleOldOrders() {
    this.logger.log('Limpinado ordenes entregadas.');
    const cleanupDays = Number(this.configService.get('CLEANUP_DAYS') || 90);
    const ordersModel = (this.ordersService as any).orderModel as typeof Order;
  
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - cleanupDays);

    const deletedCount = await ordersModel.destroy({
      where: {
        status: OrderStatus.DELIVERED,
        updatedAt: { [Op.lt]: limitDate },
      },
    });

    this.logger.log(`Se eliminaron ${deletedCount} órdenes entregadas y antiguas.`);
    
    const cacheManager = (this.ordersService as any).cacheManager;
    if (cacheManager) {
      await cacheManager.del('orders:active');
      this.logger.log('Cache de órdenes actualizada.');
    }
  }
}
