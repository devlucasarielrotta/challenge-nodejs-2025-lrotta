import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [OrdersModule, SeedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
