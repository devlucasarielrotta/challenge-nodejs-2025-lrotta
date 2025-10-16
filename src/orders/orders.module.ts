import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CleanupOrdersJob } from './jobs/cleanup-orders.job';

@Module({
  imports:[
    SequelizeModule.forFeature([Order,OrderItem]),
    ConfigModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, CleanupOrdersJob],
  exports:[OrdersService]
})
export class OrdersModule {}
