import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateOrderItemDto{

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsPositive()
    @Min(1)
    quantity: number;

    @IsNumber()
    @IsPositive()
    @Min(1)
    unitPrice: number;
 
}