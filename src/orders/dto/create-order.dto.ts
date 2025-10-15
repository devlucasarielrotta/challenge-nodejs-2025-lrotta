import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateOrderItemDto } from "./create-order-item.dto";
import { Type } from "class-transformer";

export class CreateOrderDto {

    @IsString()
    @IsNotEmpty()
    clientName: string;
    
    @IsArray()
    @ValidateNested({each:true})
    @Type(()=> CreateOrderItemDto)
    items: CreateOrderItemDto[]
  
}

