import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseFilters } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Post('orders/:id/advance')
  remove(@Param('id', new ParseUUIDPipe({version:'4'})) id: string) {
    return this.ordersService.remove(id);
  }
  
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('orders/:id')
  findOne(@Param('id', new ParseUUIDPipe({version:'4'})) id: string) {
    return this.ordersService.findOne(id);
  }

 
}
