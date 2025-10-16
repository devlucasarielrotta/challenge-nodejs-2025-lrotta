import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CleanupOrdersJob } from './jobs/cleanup-orders.job';

@Module({
  imports:[SequelizeModule.forFeature([Order,OrderItem])],
  controllers: [OrdersController],
  providers: [OrdersService, CleanupOrdersJob],
})
export class OrdersModule {}
