import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Op } from 'sequelize';

import { OrdersService } from '../orders.service';

import { Order } from '../entities/order.entity';
import { OrderStatus } from '../entities/enums/orderStatus.enum';

@Injectable()
export class CleanupOrdersJob {
  private readonly logger = new Logger(CleanupOrdersJob.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleOldOrders() {
    this.logger.log('Limpinado ordenes entregadas.');
    
    const ordersModel = (this.ordersService as any).orderModel as typeof Order;

    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 90);

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
