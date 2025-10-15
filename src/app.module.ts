import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { SeedModule } from './seed/seed.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';


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
        models: [],
      })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
