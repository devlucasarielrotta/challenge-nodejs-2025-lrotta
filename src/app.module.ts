import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CacheModule } from '@nestjs/cache-manager';

import KeyvRedis from '@keyv/redis';

import { OrdersModule } from './orders/orders.module';
import { SeedModule } from './seed/seed.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';


@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: new KeyvRedis(configService.get('REDIS_URL') || 'redis://localhost:6379'),
        ttl: 30000,
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    OrdersModule,
    SeedModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST, 
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadModels: true,
      models: [Order, OrderItem],
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
