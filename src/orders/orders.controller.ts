import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';


@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Post(':id/advance')
  remove(@Param('id', new ParseUUIDPipe({version:'4'})) id: string) {
    return this.ordersService.advanceStatus(id);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({version:'4'})) id: string) {
    return this.ordersService.findOne(id);
  }

 
}
