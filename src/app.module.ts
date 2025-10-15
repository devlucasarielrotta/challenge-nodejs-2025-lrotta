import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { OrdersModule } from './orders/orders.module';
import { SeedModule } from './seed/seed.module';

import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';


@Module({
  imports: [
      ConfigModule.forRoot(),
      OrdersModule, 
      SeedModule, 
      SequelizeModule.forRoot({
        dialect:'postgres',
        host: process.env.DB_HOST, // localhost
        port: +process.env.DB_PORT!,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        autoLoadModels: true,
        models: [Order,OrderItem],
      })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
