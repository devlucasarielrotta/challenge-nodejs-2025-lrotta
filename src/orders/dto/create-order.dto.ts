import { ArrayMinSize, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { CreateOrderItemDto } from "./create-order-item.dto";

export class CreateOrderDto {

    @IsString()
    @IsNotEmpty()
    clientName: string;
    
    @IsArray()
    @ArrayMinSize(1, { message: 'Debe haber al menos un item en la orden.' })
    @ValidateNested({each:true})
    @Type(()=> CreateOrderItemDto)
    items: CreateOrderItemDto[]
  
}

