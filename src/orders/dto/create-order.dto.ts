import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { CreateOrderItemDto } from "./create-order-item.dto";

export class CreateOrderDto {

    @IsString()
    @IsNotEmpty()
    clientName: string;
    
    @IsArray()
    @ValidateNested({each:true})
    @Type(()=> CreateOrderItemDto)
    items: CreateOrderItemDto[]
  
}

