import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [OrdersModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
