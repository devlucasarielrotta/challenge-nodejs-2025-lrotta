import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';

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
        store: new KeyvRedis(configService.get<string>('REDIS_URL') || 'redis://localhost:6379'),
        ttl: 30000,
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
        models: [Order, OrderItem],
      }),
      inject: [ConfigService],
    }),

    ScheduleModule.forRoot(),
    OrdersModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
