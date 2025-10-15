import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateOrderItemDto{

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsInt()
    @IsPositive()
    @Min(1)
    quantity: number;

    @IsInt()
    @IsPositive()
    @Min(1)
    unitPrice: number;
 
}